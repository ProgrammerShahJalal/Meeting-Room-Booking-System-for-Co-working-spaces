import { Request, Response } from 'express';
import Stripe from 'stripe';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20',
});

console.log('key', process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = catchAsync(
  async (req: Request, res: Response) => {
    const { date, slots, room, user, totalAmount } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Room Booking for ${date}`,
            },
            unit_amount: totalAmount * 100, // Stripe amount is in cents
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      metadata: {
        date,
        slots: JSON.stringify(slots),
        room,
        user,
      },
    });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Checkout session created successfully',
      data: { sessionId: session.id },
    });
  },
);

export const PaymentController = {
  createCheckoutSession,
};
