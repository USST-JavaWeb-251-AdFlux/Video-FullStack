import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { username, password } = body;
    const config = useRuntimeConfig();

    if (!username || !password) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Username and password are required',
        });
    }

    const users = await db`SELECT * FROM users WHERE username = ${username}`;
    const user = users[0];

    if (!user) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Invalid credentials',
        });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Invalid credentials',
        });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, config.jwtSecret, {
        expiresIn: '24h',
    });

    return { token, user: { id: user.id, username: user.username } };
});
