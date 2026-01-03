import bcrypt from 'bcryptjs';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { username, password } = body;

    if (!username || !password) {
        throw createError({
            statusCode: 400,
            statusMessage: '用户名和密码是必填项',
        });
    }

    if (username.length < 4 || username.length > 255) {
        throw createError({
            statusCode: 400,
            statusMessage: '用户名长度必须在 4 到 255 个字符之间',
        });
    }

    if (password.length < 8 || password.length > 255) {
        throw createError({
            statusCode: 400,
            statusMessage: '密码长度必须在 8 到 255 个字符之间',
        });
    }

    // Check if user exists
    const existingUsers = await sql`SELECT id FROM users WHERE username = ${username}`;
    if (existingUsers.length > 0) {
        throw createError({
            statusCode: 409,
            statusMessage: '用户名已存在',
        });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    await sql`
        INSERT INTO users (username, password_hash)
        VALUES (${username}, ${hash})
    `;

    return { success: true };
});
