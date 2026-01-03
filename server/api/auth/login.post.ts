import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { username, password } = body;
    const config = useRuntimeConfig();

    if (!username || !password) {
        throw createError({
            statusCode: 400,
            statusMessage: '用户名和密码是必填项',
        });
    }

    const users = await sql<User[]>`SELECT * FROM users WHERE username = ${username}`;
    const user = users[0];

    if (!user) {
        throw createError({
            statusCode: 401,
            statusMessage: '用户名或密码错误',
        });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
        throw createError({
            statusCode: 401,
            statusMessage: '用户名或密码错误',
        });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, config.jwtSecret, {
        expiresIn: '24h',
    });

    return { token, user: { id: user.id, username: user.username } };
});
