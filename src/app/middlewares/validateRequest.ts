import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

const validateRequest = (schema: ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // schema.parse(req.body);
      next();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred';
      return res.status(400).json({ success: false, message: errorMessage });
    }
  };
};

export default validateRequest;
