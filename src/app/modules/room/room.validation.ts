import { z } from 'zod';

const createRoomValidationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  roomNo: z.number().int().min(1, 'Room number must be a positive integer'),
  floorNo: z
    .number()
    .int()
    .min(0, 'Floor number must be a non-negative integer'),
  capacity: z.number().int().min(1, 'Capacity must be a positive integer'),
  pricePerSlot: z
    .number()
    .min(0, 'Price per slot must be a non-negative number'),
  amenities: z.array(z.string()).nonempty('Amenities must be provided'),
  imageUrl: z.string().url('Invalid image URL').optional(),
});

const updateRoomValidationSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  roomNo: z
    .number()
    .int()
    .min(1, 'Room number must be a positive integer')
    .optional(),
  floorNo: z
    .number()
    .int()
    .min(0, 'Floor number must be a non-negative integer')
    .optional(),
  capacity: z
    .number()
    .int()
    .min(1, 'Capacity must be a positive integer')
    .optional(),
  pricePerSlot: z
    .number()
    .min(0, 'Price per slot must be a non-negative number')
    .optional(),
  amenities: z
    .array(z.string())
    .nonempty('Amenities must be provided')
    .optional(),
  imageUrl: z.string().url('Invalid image URL').optional(),
});

export { createRoomValidationSchema, updateRoomValidationSchema };
