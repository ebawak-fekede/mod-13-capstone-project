import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodType, } from 'zod';

export const validate = (schema: ZodType) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: {
            message: 'Validation failed',
            details: error.issues.map(e => ({
              path: e.path.join('.'),
              message: e.message,
            })),
          },
        });
      }
      next(error);
    }
  };
};
