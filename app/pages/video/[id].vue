<template>
    <div v-if="video" class="video-detail-container">
        <el-card class="video-player-card">
            <template #header>
                <h1 class="video-title">{{ video.title }}</h1>
            </template>
            <div class="video-wrapper">
                <video controls class="video-player" :src="video.url" />
            </div>
            <div class="video-info">
                <el-avatar :size="40" icon="UserFilled" />
                <div class="uploader-info">
                    <div class="uploader-name">{{ video.uploader }}</div>
                    <div class="video-meta">
                        <span
                            >发布于
                            {{
                                new Date(video.created_at).toLocaleString('zh-CN', {
                                    dateStyle: 'short',
                                    timeStyle: 'medium',
                                })
                            }}</span
                        >
                        <el-tag size="small" type="info" class="category-tag">{{
                            getCategoryLabel(video.category)
                        }}</el-tag>
                    </div>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script setup lang="ts">
const route = useRoute();
const { data: video } = await useFetch(`/api/videos/${route.params.id}`);

const appConfig = useAppConfig();
const videoCategories = appConfig.videoCategories;

const getCategoryLabel = (value?: string) => {
    return videoCategories?.find((c) => c.value === value)?.label || value;
};

useHead(() => ({
    meta: [
        {
            name: 'adflux-page-category',
            content: getCategoryLabel(video.value?.category),
        },
    ],
}));
</script>

<style scoped>
.video-detail-container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 20px;
}
.video-player-card {
    border-radius: 8px;
}
.video-title {
    margin: 0;
    font-size: 24px;
    font-weight: bold;
}
.video-wrapper {
    width: 100%;
    background-color: #000;
    border-radius: 4px;
    overflow: hidden;
    aspect-ratio: 16 / 9;
}
.video-player {
    width: 100%;
    height: 100%;
}
.video-info {
    margin-top: 20px;
    display: flex;
    align-items: center;
    gap: 12px;
}
.uploader-name {
    font-weight: 600;
    font-size: 16px;
}
.video-meta {
    font-size: 12px;
    color: #909399;
    margin-top: 4px;
    display: flex;
    align-items: center;
    gap: 8px;
}
.category-tag {
    font-size: 10px;
}
</style>
