export default defineEventHandler(async () => {
    // Randomize order
    const videos = await db`
        SELECT v.id, v.title, v.thumbnail_url, v.duration, u.username as uploader
        FROM videos v
        JOIN users u ON v.uploader_id = u.id
        ORDER BY RANDOM()
        LIMIT 20
    `;
    return videos;
});
