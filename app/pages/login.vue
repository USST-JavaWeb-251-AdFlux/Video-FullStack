<template>
    <div class="auth-container">
        <el-card class="auth-card">
            <template #header>
                <h2 class="auth-title">登录</h2>
            </template>
            <el-form label-position="top" @submit.prevent="handleLogin">
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
                    登录
                </el-button>
                <div class="auth-footer">
                    还没有账号？ <NuxtLink to="/register">立即注册</NuxtLink>
                </div>
            </el-form>
        </el-card>
    </div>
</template>

<script setup lang="ts">
const username = ref('');
const password = ref('');
const loading = ref(false);

const handleLogin = async () => {
    loading.value = true;
    try {
        const { token, user } = await $fetch('/api/auth/login', {
            method: 'POST',
            body: { username: username.value, password: password.value },
        });

        const tokenCookie = useCookie('token');
        const userCookie = useCookie<typeof user>('user');
        tokenCookie.value = token;
        userCookie.value = user;

        ElMessage.success('登录成功');
        navigateTo('/');
    } catch (error: unknown) {
        const e = error as { data?: { statusMessage?: string } };
        ElMessage.error(e.data?.statusMessage || '登录失败');
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
