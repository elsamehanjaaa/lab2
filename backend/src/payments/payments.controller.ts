// backend/src/payments/payments.controller.ts
import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  Req,
  // Inject, // Not used directly in constructor for DI decorators
  Logger,
  RawBodyRequest,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentsService } from './payments.service';
import { EnrollmentsService } from '../enrollments/enrollments.service';
import { CreateEnrollmentDto } from '../enrollments/dto/create-enrollment.dto';
import { CreatePaymentDto } from '../payments/dto/create-payment.dto';
import Stripe from 'stripe';
import { Response, Request } from 'express';
import { OrdersService } from 'src/orders/orders.service';
interface VerificationResult {
  isValid: boolean;
  message?: string;
  paymentStatus?: Stripe.Checkout.Session.PaymentStatus;
  orderStatus?: string;
  orderId?: string; // Your internal order ID
  userId?: string;
  customerEmail?: string | null;
}
@Controller('payments')
export class PaymentsController {
  private readonly stripe: Stripe;
  private readonly logger = new Logger(PaymentsController.name);

  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly enrollmentsService: EnrollmentsService,
    private readonly configService: ConfigService,
    private readonly ordersService: OrdersService, // Correctly injected
  ) {
    const stripeSecretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      this.logger.error(
        'STRIPE_SECRET_KEY is not defined in environment variables',
      );
      throw new Error(
        'STRIPE_SECRET_KEY is not defined in environment variables',
      );
    }
    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-04-30.basil', // Updated to match Stripe typings requirement
    });
  }

  @Post('create-checkout-session')
  async createCheckoutSession(
    @Body() body: CreatePaymentDto,
    @Res() res: Response,
  ) {
    try {
      const frontendUrl =
        this.configService.get<string>('FRONTEND_URL') ||
        'http://localhost:3000';
      const successUrl = `${frontendUrl}/placedorder?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${frontendUrl}/payment-cancel`;

      this.logger.debug(
        `Creating checkout session for userId: ${body.userId} with items: ${JSON.stringify(body.cartItems)}`,
      );

      const sessionData = await this.paymentsService.createCheckoutSession(
        body.cartItems.map((item) => ({
          id: item.id,
          courseId: item.courseId,
          title: item.title ?? '',
          price: String(item.price),
          quantity: item.quantity,
          thumbnail: item.thumbnail,
        })),
        successUrl,
        cancelUrl,
        body.userId,
        body.couponCode ?? null,
      );

      return res.status(HttpStatus.OK).json({
        url: sessionData.url,
        sessionId: sessionData.sessionId,
        orderId: sessionData.orderId, // Assuming your service returns your internal orderId
      });
    } catch (error) {
      this.logger.error(
        `Failed to create checkout session: ${error.message}`,
        error.stack,
      );
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to create checkout session',
        error: error.message,
      });
    }
  }

  @Post('webhook')
  async handleStripeWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Res() res: Response,
  ) {
    const sig = req.headers['stripe-signature'] as string;
    const webhookSecret = this.configService.get<string>(
      'STRIPE_WEBHOOK_SECRET',
    );
    let event: Stripe.Event;

    try {
      if (!req.rawBody) {
        this.logger.error('⚠️ Raw body is missing from the request.');
        return res
          .status(HttpStatus.BAD_REQUEST)
          .send('Webhook Error: Raw body is missing.');
      }
      if (!webhookSecret) {
        this.logger.error('⚠️ STRIPE_WEBHOOK_SECRET is not defined.');
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .send('Webhook Error: Server configuration error.');
      }
      if (!sig) {
        this.logger.error(
          '⚠️ Stripe signature is missing from the request headers.',
        );
        return res
          .status(HttpStatus.BAD_REQUEST)
          .send('Webhook Error: Missing Stripe signature.');
      }

      event = this.stripe.webhooks.constructEvent(
        req.rawBody,
        sig,
        webhookSecret,
      );
    } catch (err) {
      this.logger.error(
        `⚠️ Webhook signature verification failed: ${err.message}`,
        err.stack,
      );
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(`Webhook Error: ${err.message}`);
    }

    this.logger.log(`Received Stripe event: ${event.type} [ID: ${event.id}]`);
    let sessionForFulfillment: Stripe.Checkout.Session | null = null;

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const completedSession = event.data.object as Stripe.Checkout.Session;
        this.logger.log(
          `Checkout session completed: ${completedSession.id}, Payment Status: ${completedSession.payment_status}`,
        );
        // For synchronous payment methods (most cards), payment_status will be 'paid'
        if (completedSession.payment_status === 'paid') {
          sessionForFulfillment = completedSession;
        } else if (completedSession.payment_status === 'unpaid') {
          this.logger.log(
            `Checkout session ${completedSession.id} requires asynchronous payment. Waiting for async success event.`,
          );
          // No fulfillment here; wait for checkout.session.async_payment_succeeded
        } else if (completedSession.payment_status === 'no_payment_required') {
          this.logger.log(
            `Checkout session ${completedSession.id} requires no payment. Handling as success.`,
          );
          sessionForFulfillment = completedSession; // Or specific logic if needed
        }
        break;

      case 'checkout.session.async_payment_succeeded':
        const asyncSuccessSession = event.data
          .object as Stripe.Checkout.Session;
        this.logger.log(
          `Checkout session async payment succeeded: ${asyncSuccessSession.id}`,
        );
        sessionForFulfillment = asyncSuccessSession;
        break;

      case 'checkout.session.async_payment_failed':
        const asyncFailedSession = event.data.object as Stripe.Checkout.Session;
        this.logger.warn(
          `Checkout session async payment failed: ${asyncFailedSession.id}. Order ID: ${asyncFailedSession.metadata?.orderId}`,
        );
        // Update your internal order to a 'failed payment' status if necessary
        if (asyncFailedSession.metadata?.orderId) {
          try {
            await this.ordersService.updateOrderStatus(
              asyncFailedSession.metadata.orderId,
              'FAILED_PAYMENT',
            );
          } catch (e) {
            this.logger.error(
              `Error updating order status to FAILED_PAYMENT for order ${asyncFailedSession.metadata.orderId}: ${e.message}`,
            );
          }
        }
        break;

      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        this.logger.log(
          `PaymentIntent succeeded: ${paymentIntent.id}. Order ID: ${paymentIntent.metadata?.orderId}`,
        );
        // This event confirms the payment itself was successful.
        // If you rely solely on checkout.session.completed (with payment_status: 'paid') and
        // checkout.session.async_payment_succeeded, you might not need to duplicate fulfillment logic here.
        // However, it's a good place to ensure your internal 'payments' table record is up-to-date.
        // If you *did* want to trigger fulfillment here, you'd need to:
        // 1. Get the Checkout Session ID associated with this Payment Intent (Stripe might link them,
        //    or you might have stored this link when the PI was created).
        // 2. Retrieve the full Checkout Session object.
        // 3. Call this.handleCheckoutSessionCompleted(retrievedSession).
        // For now, we will rely on the checkout.session.* events for triggering handleCheckoutSessionCompleted.
        break;

      // The 'charge.updated' case with incorrect casting has been removed.
      // If you need to listen to charge events for other reasons (e.g., logging, refunds),
      // handle the Stripe.Charge object appropriately.

      default:
        this.logger.warn(`Unhandled event type ${event.type}`);
    }

    // If a session was identified for fulfillment, process it
    if (sessionForFulfillment) {
      try {
        this.logger.log(
          `Proceeding to fulfillment for session: ${sessionForFulfillment.id}, Order ID: ${sessionForFulfillment.metadata?.orderId}`,
        );
        await this.handleCheckoutSessionCompleted(sessionForFulfillment);
      } catch (error) {
        this.logger.error(
          `Error in fulfillment logic for session ${sessionForFulfillment.id} (Order ID: ${sessionForFulfillment.metadata?.orderId}): ${error.message}`,
          error.stack,
        );
        // Decide if this error should cause Stripe to retry the webhook.
        // Returning 500 will make Stripe retry. If it's a non-transient error in your logic,
        // this could lead to repeated failures.
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .send(`Webhook fulfillment failed: ${error.message}`);
      }
    }

    // Return a 200 response to acknowledge receipt of the event
    res.status(HttpStatus.OK).send({ received: true });
  }

  // handleCheckoutSessionCompleted remains largely the same as your provided version,
  // but ensure its logic is idempotent (safe to call multiple times for the same order without issues)
  // and that it correctly uses the orderId from session.metadata.
  private async handleCheckoutSessionCompleted(
    session: Stripe.Checkout.Session,
  ) {
    const userId = session.metadata?.userId;
    const orderId = session.metadata?.orderId; // Your internal order ID from session metadata
    const stripeSessionId = session.id;

    if (!userId || !orderId) {
      // Check for both userId and orderId
      this.logger.error(
        `User ID or Order ID not found in metadata for session: ${stripeSessionId}. Cannot fulfill. Metadata: ${JSON.stringify(session.metadata)}`,
      );
      // Do not throw an error that causes Stripe to retry if metadata is missing,
      // as retrying won't fix missing metadata. This is a setup issue.
      return;
    }

    this.logger.log(
      `Fulfillment started for Order ID: ${orderId}, User ID: ${userId}, Stripe Session: ${stripeSessionId}`,
    );

    // Step 2: Fulfill items (e.g., enrollments)
    const sessionWithLineItems = await this.stripe.checkout.sessions.retrieve(
      stripeSessionId,
      { expand: ['line_items', 'line_items.data.price.product'] },
    );

    if (!sessionWithLineItems.line_items?.data.length) {
      this.logger.error(
        `No line items found for session ${stripeSessionId} (Order ID: ${orderId}). Cannot fulfill.`,
      );
      await this.ordersService.updateOrderStatus(
        orderId,
        'FULFILLMENT_ERROR_NO_ITEMS',
      );
      return;
    }

    let allItemsFulfilled = true;
    for (const item of sessionWithLineItems.line_items.data) {
      const product = item.price?.product as Stripe.Product | undefined;
      const courseId = product?.metadata?.courseId;

      if (courseId) {
        this.logger.log(
          `Fulfilling item: Course ${courseId} for Order ${orderId}, User ${userId}`,
        );
        try {
          const existingEnrollment =
            await this.enrollmentsService.findOneByUserIdAndCourseId(
              userId,
              courseId,
            );
          if (existingEnrollment) {
            this.logger.log(
              `User ${userId} already enrolled in Course ${courseId}. Skipping enrollment.`,
            );
            continue;
          }
          const enrollmentDto: CreateEnrollmentDto = {
            user_id: userId,
            course_id: courseId,
            // order_id: orderId, // Good to add for tracking
          };
          await this.enrollmentsService.create(enrollmentDto);
          this.logger.log(
            `Enrolled User ${userId} in Course ${courseId} for Order ${orderId}.`,
          );
        } catch (enrollmentError) {
          allItemsFulfilled = false;
          this.logger.error(
            `Failed to enroll User ${userId} in Course ${courseId} (Order ${orderId}): ${enrollmentError.message}`,
            enrollmentError.stack,
          );
          // Continue to other items
        }
      } else {
        allItemsFulfilled = false; // Or handle as a non-critical warning if some line items might not be courses
        this.logger.warn(
          `Course ID missing in product metadata for line item ${item.id} in Order ${orderId}.`,
        );
      }
    }

    // Step 3: Finalize order status based on fulfillment outcome
    if (allItemsFulfilled) {
      await this.ordersService.updateOrderStatus(orderId, 'completed');
      this.logger.log(
        `Order ${orderId} successfully fulfilled and marked as COMPLETED.`,
      );
    } else {
      await this.ordersService.updateOrderStatus(orderId, 'failed'); // Or a more specific error status
      this.logger.error(
        `Order ${orderId} encountered errors during item fulfillment.`,
      );
    }
  }
  @Post('verify-session')
  async verifyCheckoutSession(@Body() body: any): Promise<VerificationResult> {
    const sessionId = body.session_id; // Extract sessionId from the request body

    if (!sessionId) {
      throw new BadRequestException('Session ID is required.'); // Use NestJS exceptions
    }
    try {
      const verificationResult =
        await this.paymentsService.verifyCheckoutSession(sessionId);
      return verificationResult;
    } catch (error) {
      this.logger.error(
        `Error in verifySessionEndpoint for ${sessionId}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to verify session due to an internal error.',
      );
    }
  }
}
