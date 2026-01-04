import fs from 'node:fs';
import path from 'node:path';

export default defineEventHandler(async (event) => {
    const filePath = event.context.params?.path;
    if (!filePath) {
        throw createError({ statusCode: 400, statusMessage: '缺少文件路径' });
    }

    const uploadDir = path.resolve(process.cwd(), 'uploads');
    const fullPath = path.resolve(uploadDir, filePath);

    // 安全检查：确保路径在上传目录内
    if (!fullPath.startsWith(uploadDir)) {
        throw createError({ statusCode: 403, statusMessage: '禁止访问' });
    }

    if (!fs.existsSync(fullPath)) {
        throw createError({ statusCode: 404, statusMessage: '文件不存在' });
    }

    const stats = fs.statSync(fullPath);
    const ext = path.extname(fullPath).toLowerCase();

    const mimeTypes: Record<string, string> = {
        '.mp4': 'video/mp4',
        '.webm': 'video/webm',
        '.ogg': 'video/ogg',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
    };

    const contentType = mimeTypes[ext] || 'application/octet-stream';

    // 处理 Range 请求（用于视频拖动进度条）
    const range = getHeader(event, 'range');

    if (range) {
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1;

        if (start >= stats.size) {
            setResponseHeader(event, 'Content-Range', `bytes */${stats.size}`);
            throw createError({
                statusCode: 416,
                statusMessage: 'Requested Range Not Satisfiable',
            });
        }

        const chunksize = end - start + 1;
        const file = fs.createReadStream(fullPath, { start, end });

        setResponseHeaders(event, {
            'Content-Range': `bytes ${start}-${end}/${stats.size}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize.toString(),
            'Content-Type': contentType,
        });

        setResponseStatus(event, 206);
        return file;
    } else {
        setResponseHeaders(event, {
            'Content-Length': stats.size.toString(),
            'Content-Type': contentType,
            'Accept-Ranges': 'bytes',
        });

        return fs.createReadStream(fullPath);
    }
});
