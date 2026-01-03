<template>
    <div class="auth-container">
        <el-card class="auth-card">
            <template #header>
                <h2 class="auth-title">注册</h2>
            </template>
            <el-form label-position="top" @submit.prevent="handleRegister">
                <el-form-item label="用户名">
                    <el-input v-model="username" placeholder="请输入用户名" />
                </el-form-item>
                <el-form-item label="密码">
                    <el-input
                        v-model="password"
                        type="password"
                        show-password
                        placeholder="请输入密码"
                    />
                </el-form-item>
                <el-button
                    type="primary"
                    native-type="submit"
                    class="submit-btn"
                    :loading="loading"
                >
                    注册
                </el-button>
                <div class="auth-footer">已有账号？ <NuxtLink to="/login">立即登录</NuxtLink></div>
            </el-form>
        </el-card>
    </div>
</template>

<script setup lang="ts">
useHead({
    title: '注册 | Video Hub',
});

const username = ref('');
const password = ref('');
const loading = ref(false);

const handleRegister = async () => {
    if (username.value.length < 4 || username.value.length > 255) {
        ElMessage.error('用户名长度必须在 4 到 255 个字符之间');
        return;
    }
    if (password.value.length < 8 || password.value.length > 255) {
        ElMessage.error('密码长度必须在 8 到 255 个字符之间');
        return;
    }
    loading.value = true;
    try {
        await $fetch('/api/auth/register', {
            method: 'POST',
            body: { username: username.value, password: password.value },
        });

        ElMessage.success('注册成功，请登录');
        navigateTo('/login');
    } catch (error: unknown) {
        const e = error as { data?: { statusMessage?: string } };
        ElMessage.error(e.data?.statusMessage || '注册失败');
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
.auth-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 60px;
}
.auth-card {
    width: 100%;
    max-width: 400px;
    border-radius: 8px;
}
.auth-title {
    margin: 0;
    text-align: center;
    font-size: 20px;
}
.submit-btn {
    width: 100%;
    margin-top: 10px;
}
.auth-footer {
    margin-top: 16px;
    text-align: center;
    font-size: 14px;
    color: #606266;
}
.auth-footer a {
    color: #409eff;
    text-decoration: none;
}
</style>
