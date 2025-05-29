// backend/src/payments/payments.service.ts
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { InjectModel } from '@nestjs/mongoose'; // Only if PaymentsModel is used in this file
// import { Payments } from 'src/schemas/payments.schema'; // Only if PaymentsModel is used
// import { MongooseService } from 'src/mongoose/mongoose.service'; // Remove if not directly used here
// import { SupabaseService } from 'src/supabase/supabase.service'; // Remove if not directly used here
import Stripe from 'stripe';
// import { Model } from 'mongoose'; // Only if PaymentsModel is used
import { OrdersService } from 'src/orders/orders.service';
import { OrderItemsService } from 'src/order_items/order_items.service';
import { v4 as uuidv4 } from 'uuid'; // Import uuid for generating order IDs

interface LineItemInput {
  id: string; // Your internal product/cart item ID
  courseId: string;
  title: string;
  price: string; // e.g., "10.99"
  quantity: number;
  thumbnail: string;
}
interface VerificationResult {
  isValid: boolean;
  message?: string;
  paymentStatus?: Stripe.Checkout.Session.PaymentStatus;
  orderStatus?: string;
  orderId?: string; // Your internal order ID
  userId?: string;
  customerEmail?: string | null;
}
@Injectable()
export class PaymentsService {
  private readonly stripe: Stripe;
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private configService: ConfigService,
    // private supabaseService: SupabaseService,
    // private mongooseService: MongooseService,
    private ordersService: OrdersService,
    private orderItemsService: OrderItemsService,
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
      apiVersion: '2025-04-30.basil', // Use the required Stripe API version
    });
  }

  async createCheckoutSession(
    items: LineItemInput[],
    successUrl: string,
    cancelUrl: string,
    userId: string,
    couponCode?: string | null,
  ) {
    const internalOrderId = uuidv4();
    this.logger.log(
      `Generated Internal Order ID: ${internalOrderId} for User ID: ${userId}`,
    );

    try {
      const lineItemsStripe: Stripe.Checkout.SessionCreateParams.LineItem[] =
        items.map((item) => ({
          price_data: {
            currency: 'eur',
            product_data: {
              name: item.title,
              images: item.thumbnail ? [item.thumbnail] : [],
              metadata: {
                courseId: item.courseId,
              },
            },
            unit_amount: Math.round(Number(item.price) * 100),
          },
          quantity: item.quantity,
        }));

      const sessionOptions: Stripe.Checkout.SessionCreateParams = {
        payment_method_types: ['card'],
        line_items: lineItemsStripe,
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          userId: userId,
          orderId: internalOrderId,
        },
        allow_promotion_codes: true,
      };

      if (couponCode) {
        this.logger.log(
          `Coupon code provided: ${couponCode}. Ensure handling for Stripe Promotion Codes if applicable.`,
        );
      }

      const stripeSession =
        await this.stripe.checkout.sessions.create(sessionOptions);
      this.logger.log(
        `Stripe Checkout Session created: ${stripeSession.id} for Internal Order ID: ${internalOrderId}`,
      );

      const createdOrderInDb = await this.createOrderAndItemsInDb(
        internalOrderId,
        userId,
        items,
        stripeSession.id,
        'eur',
      );
      console.log(createdOrderInDb);

      return {
        url: stripeSession.url,
        sessionId: stripeSession.id,
        orderId: internalOrderId,
      };
    } catch (error) {
      this.logger.error(
        `Stripe Checkout Session or DB Order Error for User ID ${userId} (Order ID ${internalOrderId}): ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to create Stripe Checkout session or initial order.',
      );
    }
  }

  async createOrderAndItemsInDb(
    internalOrderId: string,
    userId: string,
    items: LineItemInput[],
    stripeSessionId: string,
    currency: string,
  ) {
    const totalAmountInCents = items.reduce(
      (total, item) =>
        total + Math.round(Number(item.price) * 100) * item.quantity,
      0,
    );

    const orderData = {
      id: internalOrderId,
      user_id: userId,
      status: 'pending',
      total_amount: totalAmountInCents,
      currency: currency.toLowerCase(),
      stripe_checkout_session_id: stripeSessionId,
    };

    const createdOrder = await this.ordersService.create(orderData);
    console.log(`Order created in DB: ${createdOrder.id}`);

    this.logger.log(`Order record created/updated in DB: ${createdOrder.id}`);

    // Create order items
    const orderItemsPromises = items.map(async (item) => {
      const orderItemData = {
        order_id: createdOrder.id,
        course_id: item.courseId,
        quantity: item.quantity,
        price: Number(item.price) * item.quantity,
      };
      return this.orderItemsService.create(orderItemData);
    });

    await Promise.all(orderItemsPromises);
    this.logger.log(`Order items created for Order ID: ${createdOrder.id}`);

    return createdOrder;
  }
  async verifyCheckoutSession(
    stripeSessionId: string,
  ): Promise<VerificationResult> {
    console.log(!stripeSessionId || typeof stripeSessionId !== 'string');

    if (!stripeSessionId || typeof stripeSessionId !== 'string') {
      this.logger.warn(
        'Verification attempt with invalid or missing session ID.',
      );
      return {
        isValid: false,
        message: 'Session ID is required and must be a string.',
      };
    }

    this.logger.log(`Verifying Stripe Checkout Session: ${stripeSessionId}`);

    try {
      const session =
        await this.stripe.checkout.sessions.retrieve(stripeSessionId);
      this.logger.log(
        `Retrieved session for verification: ${session.id}, Status: ${session.status}, Payment Status: ${session.payment_status}`,
      );

      const internalOrderId = session.metadata?.orderId;
      const internalUserId = session.metadata?.userId;

      // Core Stripe validation for successful payment
      if (session.status === 'complete' && session.payment_status === 'paid') {
        this.logger.log(
          `Stripe validation passed for session ${stripeSessionId}: Status COMPLETE, Payment PAID.`,
        );

        // Optional: Further validate against your database
        if (internalOrderId) {
          const order = await this.ordersService.findOne(internalOrderId); // Assumes this method exists
          if (!order) {
            this.logger.warn(
              `Order ${internalOrderId} (from Stripe metadata) not found in DB for verified session ${stripeSessionId}. Webhook might be delayed or an issue occurred during order creation.`,
            );
            // Decide if this scenario is "isValid: false" or if you trust Stripe and log this as a system discrepancy.
            // For client-side cart clearing, Stripe's confirmation is often enough, but this indicates a potential issue.
            return {
              isValid: true, // Stripe says paid, so session itself is "valid" from Stripe's PoV
              message:
                'Payment confirmed by Stripe, but internal order requires reconciliation (may not be created/found yet).',
              paymentStatus: session.payment_status,
              orderStatus: session.status,
              orderId: internalOrderId,
              userId: internalUserId,
              customerEmail: session.customer_details?.email,
            };
          }
          this.logger.log(
            `Internal order ${internalOrderId} found for session ${stripeSessionId}. DB Status: ${order.status}`,
          );
          // You could add more checks here, e.g., if order.status is already COMPLETED by a webhook.
        } else {
          this.logger.warn(
            `Internal OrderID missing from Stripe session metadata for session ${stripeSessionId}. Cannot perform DB cross-check for orderId.`,
          );
          // This is a more severe issue if you rely on orderId in metadata.
        }

        return {
          isValid: true,
          message: 'Session verified and payment successful.',
          paymentStatus: session.payment_status,
          orderStatus: session.status,
          orderId: internalOrderId,
          userId: internalUserId,
          customerEmail: session.customer_details?.email,
        };
      } else if (
        session.status === 'complete' &&
        session.payment_status === 'unpaid'
      ) {
        // For asynchronous payment methods
        this.logger.log(
          `Session ${stripeSessionId} payment is pending (unpaid).`,
        );
        return {
          isValid: false, // Or a specific status: 'pending_payment'
          message: 'Payment is pending confirmation by Stripe.',
          paymentStatus: session.payment_status,
          orderStatus: session.status,
          orderId: internalOrderId,
          userId: internalUserId,
        };
      } else if (session.status === 'open') {
        this.logger.log(
          `Session ${stripeSessionId} is still open and not yet completed.`,
        );
        return {
          isValid: false,
          message:
            'Checkout session is still open. Payment not yet attempted or completed.',
          paymentStatus: session.payment_status,
          orderStatus: session.status,
          orderId: internalOrderId,
          userId: internalUserId,
        };
      } else {
        // Any other combination (e.g., status 'expired', payment_status 'failed', etc.)
        this.logger.warn(
          `Session ${stripeSessionId} not valid for fulfillment. Status: ${session.status}, Payment Status: ${session.payment_status}`,
        );
        return {
          isValid: false,
          message: `Session payment not successful or session not complete (Status: ${session.status}, Payment: ${session.payment_status}).`,
          paymentStatus: session.payment_status,
          orderStatus: 'failed',
          orderId: internalOrderId,
          userId: internalUserId,
        };
      }
    } catch (error) {
      this.logger.error(
        `Error retrieving/verifying Stripe session ${stripeSessionId}: ${error.message}`,
        error.stack,
      );
      if (error.type === 'StripeInvalidRequestError') {
        // This typically means the session ID format is wrong or the session doesn't exist
        return {
          isValid: false,
          message: `Invalid or non-existent session ID: ${stripeSessionId}`,
        };
      }
      // For other errors (network issues, Stripe API down temporarily)
      throw new InternalServerErrorException(
        `Verification failed for session ${stripeSessionId}: ${error.message}`,
      );
    }
  }
}
