import { z } from 'zod';

export const userSignUpValidationSchema = z.object({
  name: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().length(10),
  role: z.enum(['admin', 'user']),
  address: z.string().min(5).max(100),
});

export const userLoginValidationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
