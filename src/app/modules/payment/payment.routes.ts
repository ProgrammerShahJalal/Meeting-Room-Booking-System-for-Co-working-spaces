import { Router } from 'express';
import { PaymentController } from './payment.controller';

const router = Router();

// Route to create a checkout session
router.post(
  '/create-checkout-session',
  PaymentController.createCheckoutSession,
);

export const PaymentRoutes = router;
