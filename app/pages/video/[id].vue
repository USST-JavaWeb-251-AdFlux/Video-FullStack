<template>
    <div v-if="video" class="video-detail-container">
        <el-card class="video-player-card">
            <template #header>
                <h1 class="video-title">{{ video.title }}</h1>
            </template>
            <div class="video-wrapper">
                <video
                    v-show="!showAd"
                    ref="videoPlayer"
                    controls
                    class="video-player"
                    :src="video.url"
                    :poster="video.thumbnail_url"
                    @timeupdate="checkProgress"
                    @seeked="checkProgress"
                />
                <adflux-video
                    v-show="showAd"
                    ref="adFluxVideo"
                    @ad-finished="onAdEnd"
                    @ad-error="onAdEnd"
                />
                <div
                    v-if="showAd"
                    class="ad-label"
                    :class="{ 'is-clickable': adFinished }"
                    @click="adFinished && closeAd()"
                >
                    <el-tooltip
                        v-if="!adFinished"
                        content="广告由 AdFlux 提供，与本站无关"
                        placement="bottom"
                    >
                        <span class="ad-text">
                            广告
                            <el-icon><ElIconInfoFilled /></el-icon>
                        </span>
                    </el-tooltip>
                    <span v-else class="ad-text">关闭广告</span>
                </div>
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

const videoPlayer = useTemplateRef('videoPlayer');
const adFluxVideo = useTemplateRef('adFluxVideo');
const adPlayed = ref(false);
const showAd = ref(false);
const adFinished = ref(false);

const checkProgress = () => {
    if (adPlayed.value || !videoPlayer.value || !videoPlayer.value.duration) return;

    const progress = (videoPlayer.value.currentTime / videoPlayer.value.duration) * 100;
    if (progress > 50) {
        videoPlayer.value.pause();
        showAd.value = true;
        nextTick(() => {
            adFluxVideo.value?.play();
        });
    }
};

const onAdEnd = () => {
    adFinished.value = true;
    adPlayed.value = true;
};

const closeAd = () => {
    showAd.value = false;
    adFinished.value = false;
    videoPlayer.value?.play();
};

const getCategoryLabel = (value?: string) => {
    return videoCategories?.find((c) => c.value === value)?.label || value;
};

useHead(() => ({
    title: () => (video.value ? `${video.value.title} | Video Hub` : 'Video Hub'),
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
    position: relative;
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
adflux-video {
    width: 100%;
    height: 100%;
    display: block;
}
.ad-label {
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 10;
    background-color: rgba(0, 0, 0, 0.4);
    color: rgba(255, 255, 255, 0.8);
    display: flex;
    align-items: center;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 14px;
    cursor: help;
    backdrop-filter: blur(4px);
    transition: all 0.3s ease;
}
.ad-label.is-clickable {
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.7);
    color: #fff;
}
.ad-label.is-clickable:hover {
    background-color: rgba(0, 0, 0, 0.9);
}
.ad-text {
    display: flex;
    align-items: center;
    gap: 4px;
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
