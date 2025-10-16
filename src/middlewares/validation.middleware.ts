import { NextFunction, Request, Response } from 'express';
import { ZodError, ZodObject } from 'zod';
import AppError from '../utils/AppError';
import { errorResponse } from '../utils/responseHandler';


const validate =
  (schema: ZodObject<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      
      
      return next();
    } catch (error) {
      
      if (error instanceof ZodError) {
        
        const errorMessages = error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        }));
        
        
        return res.status(400).json(
          errorResponse('Validation failed', 400, {
            errors: errorMessages,
          })
        );
      }
      
      
      return next(new AppError('Internal server error', 500));
    }
  };

export default validate;