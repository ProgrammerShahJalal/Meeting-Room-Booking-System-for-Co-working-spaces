/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import Stripe from 'stripe';
import Booking from '../booking/booking.model';
import Slot from '../slot/slot.model';
import { Types } from 'mongoose';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20',
});

const stripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string,
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('Webhook signature verification failed.', errorMessage);
    return res.status(400).send(`Webhook Error: ${errorMessage}`);
  }

  // Handle successful payment
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    const { date, slots, room, user } = session.metadata as any;
    console.log('session', session);
    try {
      // Create booking in the database
      const booking = await Booking.create({
        room: new Types.ObjectId(room),
        slots: JSON.parse(slots).map(
          (slotId: string) => new Types.ObjectId(slotId),
        ),
        user: new Types.ObjectId(user),
        date,
        totalAmount: session.amount_total! / 100, // Stripe amount is in cents
        isConfirmed: 'confirmed',
        paymentOption: 'stripe',
      });

      // Mark the slots as booked
      await Slot.updateMany(
        { _id: { $in: booking.slots } },
        { isBooked: true },
      );

      console.log('Booking and slot update completed successfully.');
    } catch (error) {
      console.error('Error processing Stripe webhook:', error);
      return res.status(500).send('Webhook processing failed.');
    }
  }

  res.status(200).json({ received: true });
};

export const WebhookController = {
  stripeWebhook,
};
