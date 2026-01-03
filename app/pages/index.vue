<template>
    <div class="video-grid">
        <el-row :gutter="20">
            <el-col
                v-for="video in videos"
                :key="video.id"
                :xs="24"
                :sm="12"
                :md="8"
                :lg="6"
                class="video-col"
            >
                <el-card
                    class="video-card"
                    :body-style="{ padding: '0px' }"
                    @click="navigateTo(`/video/${video.id}`)"
                >
                    <div class="thumbnail-container">
                        <img :src="video.thumbnail_url" class="thumbnail" />
                        <div class="duration-tag">{{ formatDuration(video.duration) }}</div>
                    </div>
                    <div class="video-info">
                        <h3 class="video-title">{{ video.title }}</h3>
                        <div class="video-meta">
                            <span class="uploader">{{ video.uploader }}</span>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts">
useHead({
    title: 'Video Hub',
});

const { data: videos } = await useFetch('/api/videos');

const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
};
</script>

<style scoped>
.video-grid {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}
.video-col {
    margin-bottom: 20px;
}
.video-card {
    cursor: pointer;
    transition: transform 0.3s;
    border-radius: 8px;
    overflow: hidden;
}
.video-card:hover {
    transform: translateY(-5px);
}
.thumbnail-container {
    position: relative;
    width: 100%;
    padding-top: 56.25%; /* 16:9 Aspect Ratio */
}
.thumbnail {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.duration-tag {
    position: absolute;
    bottom: 8px;
    right: 8px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 12px;
}
.video-info {
    padding: 12px;
}
.video-title {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    line-height: 1.4;
    height: 2.8em;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}
.video-meta {
    margin-top: 8px;
    font-size: 13px;
    color: #909399;
}
</style>
