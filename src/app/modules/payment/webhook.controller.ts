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
      req.body, // This is expected to be a raw body (Buffer)
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string,
    );
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('Webhook signature verification failed.', errorMessage);
    return res.status(400).send(`Webhook Error: ${errorMessage}`);
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;

      const { date, slots, room, user } = session.metadata as any;
      console.log('Metadata:', { date, slots, room, user });

      // Validate and parse slots
      let parsedSlots: Types.ObjectId[] = [];
      try {
        parsedSlots = JSON.parse(slots).map(
          (slotId: string) => new Types.ObjectId(slotId),
        );
      } catch (jsonError) {
        console.error('Failed to parse slots from metadata:', jsonError);
        return res.status(400).send(`Webhook Error: Invalid slots data`);
      }
      try {
        // Create booking in the database
        const booking = await Booking.create({
          room: new Types.ObjectId(room),
          slots: parsedSlots,
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
        if (error instanceof Error) {
          console.error(
            'Error processing Stripe webhook:',
            error.message,
            error.stack,
          );
          return res
            .status(500)
            .send(`Webhook processing failed: ${error.message}`);
        } else {
          console.error('Unknown error occurred:', error);
          return res
            .status(500)
            .send('Webhook processing failed: Unknown error');
        }
      }
      break;
    }
    case 'payment_intent.payment_failed': {
      const paymentIntentFailed = event.data.object as Stripe.PaymentIntent;
      console.error('Payment failed for session:', paymentIntentFailed.id);
      // Handle payment failure logic if necessary
      break;
    }
    default: {
      console.log(`Unhandled event type ${event.type}`);
    }
  }

  res.send();
};

export const WebhookController = {
  stripeWebhook,
};
