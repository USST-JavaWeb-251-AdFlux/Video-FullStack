# Ubuntu 部署指南 (Docker 镜像 + 宿主机数据库)

本指南介绍如何使用 Release 发布的 Docker 镜像在 Ubuntu 服务器上进行部署，并连接宿主机上的 PostgreSQL 数据库。

## 1. 环境准备

### 安装 Docker 和 Docker Compose

```bash
sudo apt update
sudo apt install docker.io docker-compose -y
sudo systemctl enable --now docker
```

### 安装并配置 PostgreSQL

1. 安装 PostgreSQL:
   ```bash
   sudo apt install postgresql -y
   ```
2. 修改配置以允许 Docker 容器访问：
   - 编辑 `/etc/postgresql/16/main/postgresql.conf` (版本号可能不同):
     将 `#listen_addresses = 'localhost'` 改为 `listen_addresses = '*'`
   - 编辑 `/etc/postgresql/16/main/pg_hba.conf`:
     在文件末尾添加一行，允许 Docker 网桥访问（通常是 172.17.0.0/16）：
     `host    all             all             172.17.0.0/16           md5`
3. 重启数据库：
   ```bash
   sudo systemctl restart postgresql
   ```
4. 创建数据库和用户：
   ```bash
   sudo -u postgres psql -c "CREATE DATABASE video_db;"
   sudo -u postgres psql -c "CREATE USER myuser WITH PASSWORD 'mypassword';"
   sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE video_db TO myuser;"
   ```

## 2. 部署步骤

1. **下载并导入镜像**：
   从 GitHub Release 下载 `video-fullstack-xxxxxxx.tar.gz`，然后运行：

   ```bash
   docker load < video-fullstack-xxxxxxx.tar.gz
   ```

   查看导入的镜像标签：

   ```bash
   docker images
   ```

   为了方便 Compose 使用，给它打上 `latest` 标签：

   ```bash
   docker tag video-fullstack:xxxxxxx video-fullstack:latest
   ```

2. **准备部署目录**：
   创建一个文件夹（如 `~/video-app`），将 `docker-compose.yml` 放入其中，并创建 `uploads` 目录：

   ```bash
   mkdir -p ~/video-app/uploads
   cd ~/video-app
   ```

3. **配置环境变量**：
   在 `~/video-app` 目录下创建 `.env` 文件：

   ```env
   # 数据库连接：使用 host.docker.internal 指向宿主机
   DATABASE_URL=postgres://myuser:mypassword@host.docker.internal:5432/video_db
   JWT_SECRET=你的随机密钥
   ADFLUX_VERIFICATION=你的验证码
   PORT=3000
   ```

4. **启动应用**：
   ```bash
   docker-compose up -d
   ```

## 3. 维护与日志

- 查看运行状态：`docker-compose ps`
- 查看日志：`docker-compose logs -f`
- 停止应用：`docker-compose down`
