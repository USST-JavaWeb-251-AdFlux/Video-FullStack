# Video Hub

**Video Hub** 是 AdFlux 项目的视频网站部分。

## 核心架构

本项目基于 **Nuxt.js** 框架开发，实现了前后端全栈式统一架构。

- **前端/后端**：Nuxt.js (Vue 3 + Nitro)
- **数据库**：PostgreSQL

## 构建与部署

本项目已接入 **GitHub Actions** 实现自动化 CI/CD 流程。

- **自动化构建**：每次提交将自动触发 [Workflow](https://github.com/USST-JavaWeb-251-AdFlux/Video-FullStack/actions/workflows/release.yml) 构建 Docker 镜像。
- **获取产物**：你可以在 [Releases](https://github.com/USST-JavaWeb-251-AdFlux/Video-FullStack/releases) 页面下载预构建完成的产物（压缩包内包含 `docker-compose.yml` 与 `video-app.tar.gz` 镜像包）。

## 本地开发

若需在开发环境下运行项目，请执行以下指令：

```bash
# 安装依赖
$ pnpm i

# 启动开发服务器
$ pnpm dev

```

## 环境变量配置

应用运行所需的变量配置详见 `.env.example`，请将其拷贝为 `.env` 后按需调整。

- **Docker 部署**：若使用 Docker Compose 运行，请参考 `docker-compose.yml` 中的 `environment` 字段进行配置。
- **安全提示**：由于 Docker 在构建（Build）阶段会将当前的 `.env` 文件打入镜像，请务必确保构建环境中不包含敏感信息（如生产环境数据库密码、JWT Secret 等）。建议通过容器运行时（Runtime）注入环境变量。
