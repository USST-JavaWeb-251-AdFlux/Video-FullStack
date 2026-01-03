import bcrypt from 'bcryptjs';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { username, password } = body;

    if (!username || !password) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Username and password are required',
        });
    }

    // Check if user exists
    const existingUsers = await db`SELECT id FROM users WHERE username = ${username}`;
    if (existingUsers.length > 0) {
        throw createError({
            statusCode: 409,
            statusMessage: 'Username already exists',
        });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    await db`
        INSERT INTO users (username, password_hash)
        VALUES (${username}, ${hash})
    `;

    return { success: true };
});
