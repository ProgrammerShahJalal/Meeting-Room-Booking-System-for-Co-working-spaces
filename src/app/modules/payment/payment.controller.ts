import { Request, Response } from 'express';
import Stripe from 'stripe';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20',
});

const createCheckoutSession = catchAsync(
  async (req: Request, res: Response) => {
    const { date, slots, room, user } = req.body;

    const lineItems = req?.body?.line_items;
    const totalAmount = lineItems[0]?.price_data?.unit_amount;

    try {
      // Validate totalAmount
      if (
        typeof totalAmount !== 'number' ||
        isNaN(totalAmount) ||
        totalAmount <= 0
      ) {
        console.log('totalAmount: ', totalAmount);
        throw new Error('Invalid totalAmount: Must be a positive number.');
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Booking',
              },
              unit_amount: totalAmount * 100,
            },
            quantity: 1,
          },
        ],
        success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/cancel`,
        metadata: {
          date,
          slots: JSON.stringify(slots), // Ensure slots are a JSON string
          room,
          user,
        },
      });

      // Return the session ID to the frontend
      res.status(200).json({ sessionId: session.id });
    } catch (error) {
      console.error('Error creating checkout session:', error);
      sendResponse(res, {
        statusCode: httpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to create checkout session',
        data: undefined,
      });
    }
  },
);

export const PaymentController = {
  createCheckoutSession,
};
