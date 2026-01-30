# 🚀 一键部署指南

本目录包含了基于 Docker 的自动化部署脚本。

## 准备工作
1. 拥有一台 Linux 服务器 (Ubuntu/Debian/CentOS)。
2. 确保服务器已开放 `80` (前端) 和 `3001` (后端) 端口。
3. 将项目代码上传到服务器。

## 快速开始
在服务器上运行以下命令：

```bash
# 赋予脚本执行权限
chmod +x deploy/deploy.sh

# 执行一键部署
./deploy/deploy.sh
```

## 常用维护命令
- **查看运行状态**: `docker compose ps`
- **查看日志**: `docker compose logs -f`
- **停止服务**: `docker compose down`
- **重启服务**: `docker compose restart`
