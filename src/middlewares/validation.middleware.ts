import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';
import AppError from '../utils/AppError';
import { errorResponse } from '../utils/responseHandler';

// Validation middleware factory
const validate =
  (schema: ZodObject<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request data against schema
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      
      // If validation passes, proceed to next middleware
      return next();
    } catch (error) {
      // If validation fails, handle ZodError
      if (error instanceof ZodError) {
        // Format Zod errors into a more readable format
        const errorMessages = error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        }));
        
        // Return validation error response
        return res.status(400).json(
          errorResponse('Validation failed', 400, {
            errors: errorMessages,
          })
        );
      }
      
      // Handle any other errors
      return next(new AppError('Internal server error', 500));
    }
  };

export default validate;