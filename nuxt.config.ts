// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },
    modules: ['@nuxt/eslint', '@element-plus/nuxt'],
    vue: {
        compilerOptions: {
            isCustomElement: (tag) => tag.startsWith('adflux-'),
        },
    },
    elementPlus: {
        icon: 'ElIcon',
    },
    css: ['~/assets/css/main.css'],
    ssr: false,
    app: {
        head: {
            meta: [
                {
                    name: 'adflux-verification',
                    content: process.env.ADFLUX_VERIFICATION,
                },
            ],
            script: [
                {
                    src: 'https://adflux.bobliu.tech/ads/main.js',
                    type: 'module',
                    tagPosition: 'bodyClose',
                },
            ],
        },
    },
    runtimeConfig: {
        dbUrl: process.env.DATABASE_URL,
        jwtSecret: process.env.JWT_SECRET,
        ffmpegPath: process.env.FFMPEG_PATH,
        ffprobePath: process.env.FFPROBE_PATH,
    },
});
