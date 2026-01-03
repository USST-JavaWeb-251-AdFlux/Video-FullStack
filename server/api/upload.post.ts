import ffmpeg from 'fluent-ffmpeg';
import formidable from 'formidable';
import fs from 'node:fs';
import path from 'node:path';
import { v4 as uuidv4 } from 'uuid';

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();

    // Set paths from environment variables
    if (config.ffmpegPath) ffmpeg.setFfmpegPath(config.ffmpegPath);
    if (config.ffprobePath) ffmpeg.setFfprobePath(config.ffprobePath);

    const user = getUserFromToken(event);

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const form = formidable({
        uploadDir,
        keepExtensions: true,
        maxFileSize: 1024 * 1024 * 1024, // 1GB
    });

    const [fields, files] = await form.parse(event.node.req);

    const videoFile = Array.isArray(files.video) ? files.video[0] : files.video;
    const thumbnailFile = Array.isArray(files.thumbnail) ? files.thumbnail[0] : files.thumbnail;
    const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;

    if (!videoFile || !thumbnailFile || !title) {
        throw createError({ statusCode: 400, statusMessage: 'Missing video, thumbnail or title' });
    }

    const videoExt = path.extname(videoFile.originalFilename || '.mp4');
    const thumbExt = path.extname(thumbnailFile.originalFilename || '.jpg');

    const videoFilename = `${uuidv4()}${videoExt}`;
    const thumbFilename = `${uuidv4()}${thumbExt}`;

    const videoPath = path.join(uploadDir, videoFilename);
    const thumbPath = path.join(uploadDir, thumbFilename);

    fs.renameSync(videoFile.filepath, videoPath);
    fs.renameSync(thumbnailFile.filepath, thumbPath);

    // Get duration
    const duration = await new Promise<number>((resolve) => {
        ffmpeg.ffprobe(videoPath, (err, metadata) => {
            if (err) {
                console.error('ffprobe error:', err);
                resolve(0);
            } else {
                resolve(metadata.format.duration || 0);
            }
        });
    });

    const videoUrl = `/uploads/${videoFilename}`;
    const thumbUrl = `/uploads/${thumbFilename}`;

    const result = await db`
        INSERT INTO videos (title, url, thumbnail_url, duration, uploader_id)
        VALUES (${title}, ${videoUrl}, ${thumbUrl}, ${duration}, ${user.id})
        RETURNING id
    `;

    return { success: true, id: result[0].id };
});
