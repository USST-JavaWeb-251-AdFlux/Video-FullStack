import type { H3Event } from 'h3';
import jwt from 'jsonwebtoken';

export const getUserFromToken = (event: H3Event) => {
    const config = useRuntimeConfig();
    const authHeader = getHeader(event, 'Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized',
        });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, config.jwtSecret);
        return decoded as { id: number; username: string };
    } catch {
        throw createError({
            statusCode: 401,
            statusMessage: 'Invalid token',
        });
    }
};
