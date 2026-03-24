import { NextFunction, Request, Response } from 'express';

import logger from '../lib/logger.js';

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    logger.error(err);

    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';

    res.status(status).json({
        error: {
            message,
            status,
        },
    });
};
