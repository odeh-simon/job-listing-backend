// validate.middleware.tsx
import { Request, Response, NextFunction } from 'express';
import { z, AnyZodObject } from 'zod';
import { ValidationError } from '../utils/error.utils';

export function validate(schema: AnyZodObject) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Only process applicationData for POST requests with a body
      if (req.method === 'POST' && req.body && req.body.applicationData && typeof req.body.applicationData === 'string') {
        try {
          const parsedData = JSON.parse(req.body.applicationData);
          // Merge parsed data into req.body
          req.body = { ...req.body, ...parsedData };
        } catch (error) {
          throw new ValidationError('Invalid applicationData JSON format');
        }
      }

      await schema.parseAsync({
        body: req.body || {}, // Provide empty object for GET requests
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      next(new ValidationError(error instanceof Error ? error.message : 'Invalid input'));
    }
  };
}