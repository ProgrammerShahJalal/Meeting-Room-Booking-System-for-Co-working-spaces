import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';

const validateRequest = (schema: AnyZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      //here we don't need to parse, we send data here after parseing
      next();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred';
      return res.status(400).json({ success: false, message: errorMessage });
    }
  };
};

export default validateRequest;
