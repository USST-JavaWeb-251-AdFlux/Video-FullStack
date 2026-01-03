export default defineNitroPlugin(async () => {
    try {
        // Read schema file
        // Note: In production, this might need adjustment depending on how files are bundled.
        // For dev, reading from source is fine.
        // A better way is to just put the SQL string here or use a migration tool.
        // For this simple task, I'll execute the SQL commands directly.

        await db`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `;

        await db`
            CREATE TABLE IF NOT EXISTS videos (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                url TEXT NOT NULL,
                thumbnail_url TEXT NOT NULL,
                duration FLOAT NOT NULL,
                uploader_id INTEGER REFERENCES users(id),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `;

        console.log('Database tables ensured.');
    } catch (e) {
        console.error('Error initializing database:', e);
    }
});
