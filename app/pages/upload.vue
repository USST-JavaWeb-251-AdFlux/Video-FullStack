<template>
    <div class="upload-container">
        <el-card class="upload-card">
            <template #header>
                <h2 class="upload-title">上传视频</h2>
            </template>
            <el-form label-position="top" @submit.prevent="handleUpload">
                <el-form-item label="视频标题">
                    <el-input v-model="title" placeholder="请输入视频标题" required />
                </el-form-item>
                <el-form-item label="视频分类">
                    <el-select
                        v-model="category"
                        placeholder="请选择视频分类"
                        style="width: 100%"
                        required
                    >
                        <el-option
                            v-for="item in videoCategories"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="视频文件">
                    <div class="file-input-wrapper">
                        <input
                            id="video-input"
                            type="file"
                            accept="video/*"
                            required
                            class="hidden-input"
                            @change="onVideoChange"
                        />
                        <label for="video-input" class="file-label">
                            <el-button
                                type="info"
                                plain
                                :icon="VideoCamera"
                                style="pointer-events: none"
                                >选择视频</el-button
                            >
                            <span v-if="videoFile" class="file-name">{{ videoFile.name }}</span>
                        </label>
                    </div>
                </el-form-item>
                <el-form-item label="封面图片">
                    <div class="file-input-wrapper">
                        <input
                            id="thumb-input"
                            type="file"
                            accept="image/*"
                            required
                            class="hidden-input"
                            @change="onThumbChange"
                        />
                        <label for="thumb-input" class="file-label">
                            <el-button
                                type="info"
                                plain
                                :icon="Picture"
                                style="pointer-events: none"
                                >选择封面</el-button
                            >
                            <span v-if="thumbFile" class="file-name">{{ thumbFile.name }}</span>
                        </label>
                    </div>
                </el-form-item>
                <el-button
                    type="primary"
                    native-type="submit"
                    class="submit-btn"
                    :loading="loading"
                >
                    开始上传
                </el-button>
            </el-form>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { Picture, VideoCamera } from '@element-plus/icons-vue';

const title = ref('');
const category = ref('');
const videoFile = ref<File | null>(null);
const thumbFile = ref<File | null>(null);
const loading = ref(false);
const token = useCookie('token');

const appConfig = useAppConfig();
const videoCategories = appConfig.videoCategories;

definePageMeta({
    middleware: () => {
        if (!token.value) {
            if (import.meta.client) {
                ElMessage.warning('请先登录');
            }
            return navigateTo('/login');
        }
    },
});

const onVideoChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files) videoFile.value = target.files[0];
};

const onThumbChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files) thumbFile.value = target.files[0];
};

const handleUpload = async () => {
    if (!videoFile.value || !thumbFile.value) return;
    loading.value = true;

    const formData = new FormData();
    formData.append('title', title.value);
    formData.append('category', category.value);
    formData.append('video', videoFile.value);
    formData.append('thumbnail', thumbFile.value);

    try {
        await $fetch('/api/upload', {
            method: 'POST',
            body: formData,
            headers: {
                Authorization: `Bearer ${token.value}`,
            },
        });
        ElMessage.success('上传成功');
        navigateTo('/');
    } catch (error) {
        ElMessage.error(error.data?.statusMessage || '上传失败');
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
.upload-container {
    display: flex;
    justify-content: center;
    padding-top: 40px;
}
.upload-card {
    width: 100%;
    max-width: 600px;
    border-radius: 8px;
}
.upload-title {
    margin: 0;
    font-size: 20px;
}
.file-input-wrapper {
    width: 100%;
}
.hidden-input {
    display: none;
}
.file-label {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
}
.file-name {
    font-size: 14px;
    color: #606266;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.submit-btn {
    width: 100%;
    margin-top: 20px;
}
</style>
