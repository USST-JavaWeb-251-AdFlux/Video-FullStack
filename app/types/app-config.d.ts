/* eslint-disable no-unused-vars */
export {};

declare module 'nuxt/schema' {
    interface AppConfigInput {
        videoCategories?: { label: string; value: string }[];
    }
    interface AppConfig {
        videoCategories: { label: string; value: string }[];
    }
}
