import ffmpeg from 'fluent-ffmpeg';
import formidable from 'formidable';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

async function getFileHash(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash('sha256');
        const stream = fs.createReadStream(filePath);
        stream.on('data', (data) => hash.update(data));
        stream.on('end', () => resolve(hash.digest('hex')));
        stream.on('error', reject);
    });
}

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig();

    // Set paths from environment variables
    if (config.ffmpegPath) ffmpeg.setFfmpegPath(config.ffmpegPath);
    if (config.ffprobePath) ffmpeg.setFfprobePath(config.ffprobePath);

    const user = getUserFromToken(event);

    const uploadDir = path.join(process.cwd(), 'uploads');
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
    const category = Array.isArray(fields.category) ? fields.category[0] : fields.category;

    if (!videoFile || !thumbnailFile || !title || !category) {
        throw createError({ statusCode: 400, statusMessage: '缺少视频、封面、标题或分类' });
    }

    const videoExt = path.extname(videoFile.originalFilename || '.mp4');
    const thumbExt = path.extname(thumbnailFile.originalFilename || '.jpg');

    const videoHash = await getFileHash(videoFile.filepath);
    const thumbHash = await getFileHash(thumbnailFile.filepath);

    const videoFilename = `${videoHash}${videoExt}`;
    const thumbFilename = `${thumbHash}${thumbExt}`;

    const videoPath = path.join(uploadDir, videoFilename);
    const thumbPath = path.join(uploadDir, thumbFilename);

    if (fs.existsSync(videoPath)) {
        fs.unlinkSync(videoFile.filepath);
    } else {
        fs.renameSync(videoFile.filepath, videoPath);
    }

    if (fs.existsSync(thumbPath)) {
        fs.unlinkSync(thumbnailFile.filepath);
    } else {
        fs.renameSync(thumbnailFile.filepath, thumbPath);
    }

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

    const result = await sql<{ id: number }[]>`
        INSERT INTO videos (title, url, thumbnail_url, duration, category, uploader_id)
        VALUES (${title}, ${videoUrl}, ${thumbUrl}, ${duration}, ${category}, ${user.id})
        RETURNING id
    `;

    return { success: true, id: result[0].id };
});
