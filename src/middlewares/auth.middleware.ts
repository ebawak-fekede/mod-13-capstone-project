import { NextFunction, Request, Response } from 'express';

import { verifyToken } from '../lib/jwt.js';

export interface AuthRequest extends Request {
    user?: {
        userId: number;
    };
}

export const authenticate = (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            error: {
                message: 'No token provided',
            },
        });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
        return res.status(401).json({
            error: {
                message: 'Invalid or expired token',
            },
        });
    }

    req.user = decoded;
    next();
};
