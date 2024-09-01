import express, { Router } from 'express';
import { PaymentController } from './payment.controller';
import { WebhookController } from './webhook.controller';

const router = Router();

// Route to create a checkout session
router.post(
  '/create-checkout-session',
  PaymentController.createCheckoutSession,
);

// Route to handle Stripe webhooks
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  WebhookController.stripeWebhook,
);

export const PaymentRoutes = router;
