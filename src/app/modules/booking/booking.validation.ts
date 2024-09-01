import { z } from 'zod';

// Validation for creating a new booking
const createBookingValidationSchema = z.object({
  body: z.object({
    date: z.string().refine((val) => /^\d{4}-\d{2}-\d{2}$/.test(val), {
      message: 'Date must be in YYYY-MM-DD format',
    }),
    slots: z.array(z.string().uuid()),
    room: z.string().uuid(),
    user: z.string().uuid(),
    paymentOption: z.enum(['stripe', 'cash']),
  }),
});

// Validation for updating a booking
const updateBookingValidationSchema = z.object({
  body: z.object({
    isConfirmed: z.enum(['confirmed', 'unconfirmed', 'canceled']),
  }),
});

export { createBookingValidationSchema, updateBookingValidationSchema };
