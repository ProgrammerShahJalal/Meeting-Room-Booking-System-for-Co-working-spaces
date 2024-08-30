import { z } from 'zod';

// Validation schema for creating a slot
const createSlotValidationSchema = z.object({
  room: z.string().min(1, 'Room is required'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  startTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid start time'),
  endTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid end time'),
});

// Validation schema for updating a slot
const updateSlotValidationSchema = z.object({
  room: z.string().min(1, 'Room is required').optional(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format')
    .optional(),
  startTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid start time')
    .optional(),
  endTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid end time')
    .optional(),
  isBooked: z.boolean().optional(), // Allow toggling the booking status
});

export { createSlotValidationSchema, updateSlotValidationSchema };
