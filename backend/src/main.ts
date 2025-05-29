import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as express from 'express'; // Ensure express is imported
import { ValidationPipe, Logger } from '@nestjs/common'; // Added Logger for consistency

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // It's often cleaner to disable NestJS's default body parser
    // when you have custom parsing logic, especially for specific routes.
    bodyParser: false,
  });
  const logger = new Logger('NestApplication'); // Use a consistent logger name or 'Bootstrap'

  app.use(
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      if (req.originalUrl === '/api/payments/webhook') {
        // Ensure this path matches your webhook route
        logger.log(
          `Webhook route (${req.originalUrl}) detected. Applying raw body parser.`,
        );
        express.raw({ type: 'application/json' })(req, res, (err) => {
          if (err) {
            logger.error('Error in express.raw for webhook:', err.message);
            return next(err);
          }
          // After express.raw(), req.body contains the Buffer.
          // Your controller (PaymentsController) expects req.rawBody.
          // So, assign req.body (which is the buffer) to req.rawBody.
          (req as any).rawBody = req.body;
          next();
        });
      } else {
        // For all other routes, use standard JSON and URL-encoded parsers
        express.json({ limit: '50mb' })(req, res, (errJson) => {
          if (errJson) {
            logger.error('Error in express.json parser:', errJson.message);
            return next(errJson);
          }
          // Important: Only call next for urlencoded if json didn't handle it,
          // or call them sequentially with the final next() call.
          // The safest way is to call next() only once after all relevant parsers have had a chance.
          // However, for typical API routes, usually only one of json or urlencoded applies.
          // To avoid issues with double next() calls for other routes:
          express.urlencoded({ extended: true, limit: '50mb' })(
            req,
            res,
            (errUrl) => {
              if (errUrl) {
                logger.error(
                  'Error in express.urlencoded parser:',
                  errUrl.message,
                );
                return next(errUrl);
              }
              next(); // Call next() after both potential parsers have run (or decided not to parse)
            },
          );
        });
      }
    },
  );

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.use(cookieParser());
  app.enableCors({
    origin: [
      'http://localhost:3000',
      process.env.FRONTEND_URL || 'http://localhost:3000',
    ],
    credentials: true,
  });

  const port = process.env.PORT || 5000;
  await app.listen(port);
  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
