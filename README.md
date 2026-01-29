# Korean Learning Platform

> 全面的韩语学习平台，整合视频、文章和交互式内容。

## 📚 文档中心

本项目采用全新的文档架构，详情请查阅 **[完整技术文档库](docs/README.md)**。

### 快速导航
- **架构设计**: [技术架构](docs/architecture/technical_architecture.md) | [业务架构](docs/architecture/business_architecture.md)
- **开发指南**: [扩展规范](docs/scalability/extension_guide.md) | [API 规范](docs/scalability/extension_guide.md#2-api-接入规范)
- **运维手册**: [部署指南](docs/scalability/scaling_guide.md) | [应急响应](docs/operations/emergency_response.md)

## 🚀 快速开始

### 1. 环境准备
- Node.js 18+
- Supabase 账号

### 2. 安装依赖
```bash
npm install
```

### 3. 启动开发环境
```bash
# 同时启动前后端
npm run dev:all  # (需配置 concurrently)

# 或分别启动
cd apps/server && npm run start:dev
cd apps/client && npm run dev
```

## 📄 许可证
[MIT](LICENSE)
