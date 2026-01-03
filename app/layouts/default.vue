<template>
    <div class="common-layout">
        <el-container>
            <el-header>
                <el-menu mode="horizontal" :router="true" :ellipsis="false" class="header-menu">
                    <el-menu-item index="/">
                        <span class="logo">VideoHub</span>
                    </el-menu-item>
                    <div class="flex-grow" />
                    <el-menu-item index="/">首页</el-menu-item>
                    <el-menu-item index="/upload">上传视频</el-menu-item>
                    <template v-if="!isLoggedIn">
                        <el-menu-item index="/login">登录</el-menu-item>
                        <el-menu-item index="/register">注册</el-menu-item>
                    </template>
                    <template v-else>
                        <el-sub-menu index="user">
                            <template #title>用户中心</template>
                            <el-menu-item @click="logout">退出登录</el-menu-item>
                        </el-sub-menu>
                    </template>
                </el-menu>
            </el-header>
            <el-main>
                <slot />
            </el-main>
        </el-container>
    </div>
</template>

<script setup>
const token = useCookie('token');
const isLoggedIn = computed(() => !!token.value);

const logout = () => {
    token.value = null;
    const user = useCookie('user');
    user.value = null;
    navigateTo('/login');
};
</script>

<style scoped>
.el-header {
    padding: 0;
}
.header-menu {
    padding: 0 20px;
    align-items: center;
}
.logo {
    font-size: 20px;
    font-weight: bold;
    color: #409eff;
}
.flex-grow {
    flex-grow: 1;
}
.el-main {
    background-color: #f5f7fa;
    min-height: calc(100vh - 60px);
}
</style>
