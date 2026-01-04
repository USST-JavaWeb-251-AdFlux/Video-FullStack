import { createReadStream, promises as fs } from 'node:fs';
import path from 'node:path';

export default defineEventHandler(async (event) => {
    const filePath = event.context.params?.path;
    if (!filePath) {
        throw createError({ statusCode: 400, statusMessage: '缺少文件路径' });
    }

    const uploadDir = path.resolve(process.cwd(), 'uploads');
    const fullPath = path.resolve(uploadDir, filePath);

    const relativePath = path.relative(uploadDir, fullPath);
    if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
        throw createError({ statusCode: 403, statusMessage: '禁止访问' });
    }

    try {
        const stats = await fs.stat(fullPath);
        if (!stats.isFile()) {
            throw createError({ statusCode: 404, statusMessage: '文件不存在' });
        }

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

        const contentType = mimeTypes[ext] ?? 'application/octet-stream';

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
            const file = createReadStream(fullPath, { start, end });

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

            return createReadStream(fullPath);
        }
    } catch (error: any) {
        if (error.statusCode) throw error;
        if (error.code === 'ENOENT') {
            throw createError({ statusCode: 404, statusMessage: '文件不存在' });
        }
        throw createError({ statusCode: 500, statusMessage: '服务器内部错误' });
    }
});
