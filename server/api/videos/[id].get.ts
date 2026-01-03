export default defineEventHandler(async (event) => {
    const id = getRouterParam(event, 'id');
    if (!id) {
        throw createError({ statusCode: 400, statusMessage: 'Missing ID' });
    }

    const videos = await sql`
        SELECT v.*, u.username as uploader
        FROM videos v
        JOIN users u ON v.uploader_id = u.id
        WHERE v.id = ${id}
    `;

    if (videos.length === 0) {
        throw createError({ statusCode: 404, statusMessage: 'Video not found' });
    }

    return videos[0];
});
