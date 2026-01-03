// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },
    modules: ['@nuxt/eslint', '@element-plus/nuxt'],
    elementPlus: {
        icon: 'ElIcon',
    },
    css: ['~/assets/css/main.css'],
    ssr: false,
    runtimeConfig: {
        dbUrl: process.env.DATABASE_URL,
        jwtSecret: process.env.JWT_SECRET,
        ffmpegPath: process.env.FFMPEG_PATH,
        ffprobePath: process.env.FFPROBE_PATH,
    },
});
