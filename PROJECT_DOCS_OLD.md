# Korean Learning Platform 项目文档

## 1. 项目概述

*   **项目名称**: Korean Learning Platform
*   **版本**: 1.0.0
*   **创建日期**: 2024-01-27
*   **最后更新日期**: 2025-01-28

### 核心目标与业务价值
本项目旨在打造一个全面的韩语学习平台，通过整合视频、文章和交互式内容，为用户提供一站式的语言学习体验。
*   **核心功能**:
    *   **资源管理**: 支持视频、文章、音频等多种格式的学习资源发布与管理。
    *   **学习追踪**: 实时记录用户的学习进度、笔记和完成状态。
    *   **个性化体验**: 基于用户偏好推荐内容（规划中），支持多语言界面（i18n）。
    *   **插件系统**: 可扩展的插件架构，允许通过插件增强平台功能。

### 目标用户与场景
*   **韩语初学者**: 寻找基础字母（Hangul）教学和常用短语。
*   **进阶学习者**: 需要通过阅读文章和观看视频来提升听力和阅读能力。
*   **内容创作者/管理员**: 发布和管理教学资源，查看用户学习数据。

---

## 2. 技术栈与平台详情

### 前端平台 (apps/client)
*   **框架**: React 18 (使用 Vite 6 构建)
*   **语言**: TypeScript (~5.8.3)
*   **UI 库**: TailwindCSS v3 (样式), Lucide React (图标), clsx/tailwind-merge (样式工具)
*   **状态管理**: Zustand (轻量级全局状态), React Query (服务端状态与缓存)
*   **路由**: React Router 7
*   **国际化**: i18next, react-i18next (支持中英多语言)
*   **包管理器**: npm (工作区模式)

### 后端平台 (apps/server)
*   **框架**: NestJS 10
*   **运行环境**: Node.js (目标 Node 18+)
*   **架构模式**: 模块化 (Modules), 控制器-服务 (Controller-Service), 依赖注入 (DI)
*   **Serverless 适配**: 使用 `@vendia/serverless-express` 和 `aws-lambda` 适配 Netlify Functions
*   **构建工具**: esbuild (用于打包 Lambda 函数)

### 部署与运维
*   **生产环境**: Netlify (托管静态前端 + Serverless 后端函数) / Vercel (备选)
*   **CI/CD**: Netlify 自动部署 (基于 Git 提交触发) / GitHub Actions (代码检查)
*   **容器化**: Docker (提供 Dockerfile 用于本地全栈运行)

### 第三方服务集成
*   **Supabase**:
    *   **Database**: 托管 PostgreSQL 数据库。
    *   **Auth**: 用户身份认证（注册、登录、JWT）。
    *   **Storage**: (可选) 存储用户头像和资源缩略图。

---

## 3. 系统访问信息

### 访问地址
*   **生产环境**: `https://[YOUR_NETLIFY_SITE_ID].netlify.app` (请替换为实际部署后的 URL)
*   **本地开发**:
    *   前端: `http://localhost:5173`
    *   后端 API: `http://localhost:3000` (或 `3001`)

### 测试账号 (仅供内部测试)
> ⚠️ **安全警告**: 以下账号仅用于开发和测试环境。生产环境中请务必修改密码或禁用此账号。

| 角色 | 用户名 (Email) | 密码 | 权限范围 |
| :--- | :--- | :--- | :--- |
| **管理员** | `admin@example.com` | `password123` | 拥有所有权限：管理用户、发布/编辑/删除所有资源、管理插件 |
| **普通用户** | (需注册) | (自定) | 仅能查看资源、记录个人学习进度、管理个人插件 |

---

## 4. 数据库架构与连接信息

### 数据库概览
*   **类型**: PostgreSQL (via Supabase)
*   **版本**: PostgreSQL 15+

### 核心数据表 (Schema)
*   **`users`**: 用户基础信息 (关联 Supabase Auth)。
    *   *字段*: `id`, `email`, `role` ('user', 'admin'), `preferences`.
*   **`resources`**: 学习资源内容。
    *   *字段*: `title`, `type` ('video', 'article'...), `content`, `difficulty`, `creator_id`.
*   **`learning_progress`**: 用户学习记录。
    *   *字段*: `user_id`, `resource_id`, `progress` (0-100), `completed`.
*   **`plugins`** & **`user_plugins`**: 系统的扩展插件及其用户级配置。

### 连接配置示例
> ⚠️ **注意**: 真实连接串包含敏感信息，切勿提交到代码仓库。

**连接字符串 (Connection String)**:
```text
postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/postgres
```
*   **Host**: `db.[project-ref].supabase.co`
*   **Port**: `5432` (通常) or `6543` (Transaction Pooler)
*   **Driver**: Node.js `pg` 或 Supabase JS Client

**访问凭证**:
应用主要通过 `@supabase/supabase-js` 客户端连接，依赖以下环境变量：
*   `SUPABASE_URL`: API 端点
*   `SUPABASE_KEY`: `service_role` key (后端使用) 或 `anon` key (前端使用)

---

## 5. 项目结构与部署指南

### 目录结构
```text
project_demo_1/
├── apps/
│   ├── client/          # React 前端项目
│   │   ├── src/
│   │   │   ├── components/  # 通用组件
│   │   │   ├── pages/       # 页面组件
│   │   │   ├── lib/         # 工具函数与 API 客户端
│   │   │   └── ...
│   │   └── ...
│   └── server/          # NestJS 后端项目
│       ├── src/
│       │   ├── auth/        # 认证模块
│       │   ├── resources/   # 资源模块
│       │   ├── progress/    # 进度模块
│       │   └── ...
│       └── ...
├── supabase/            # 数据库配置
│   ├── migrations/      # SQL 迁移脚本
│   └── seeds/           # 初始种子数据
├── netlify.toml         # Netlify 部署配置
├── package.json         # Root 依赖管理 (Workspaces)
└── PROJECT_DOCS.md      # 本文档
```

### 本地环境搭建
1.  **先决条件**:
    *   Node.js v18+
    *   npm v9+
    *   Git

2.  **安装依赖**:
    ```bash
    npm install
    ```

3.  **环境变量配置**:
    *   复制 `apps/server/.env.example` (如无则参考下文) 到 `apps/server/.env`。
    *   填入 Supabase URL 和 Key。

4.  **数据库初始化**:
    *   登录 Supabase 控制台，在 SQL Editor 中运行 `supabase/migrations/` 下的 SQL 脚本创建表结构。
    *   运行 `supabase/seeds/seed.sql` 插入测试数据。

5.  **启动开发服务器**:
    ```bash
    # 在根目录运行，同时启动前后端 (需配置 concurrently，或分别启动)
    
    # 分别启动:
    # 终端 1 (后端)
    cd apps/server && npm run start:dev
    
    # 终端 2 (前端)
    cd apps/client && npm run dev
    ```

### 部署流程 (Netlify)
1.  **构建**:
    项目根目录配置了 `npm run build`，它会触发 `npm run build --workspaces`。
    *   前端构建至 `apps/client/dist`。
    *   后端构建至 `apps/server/dist/functions` (esbuild 打包)。

2.  **发布**:
    *   **自动**: 推送代码至 GitHub/GitLab，Netlify 自动检测 `netlify.toml` 并构建部署。
    *   **手动**: 使用 `deploy_fix_v2.bat` (Windows) 或 `netlify deploy --prod`。

---

## 6. 附录

### 环境变量示例 (`.env`)
```ini
# apps/server/.env
PORT=3000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (Service Role Key)

# apps/client/.env (如需)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (Anon Key)
```

### 常见问题 (FAQ)
*   **Q: 启动后端时报错 EADDRINUSE?**
    *   A: 端口被占用。检查 `.env` 中的 `PORT` 设置，或杀掉占用端口的进程。
*   **Q: 前端无法连接后端?**
    *   A: 检查前端 API 请求的基础 URL 是否配置正确。本地开发应指向 `http://localhost:3001` (默认)。
*   **Q: 部署后出现 502 Bad Gateway?**
    *   A: 通常是因为 Nginx 配置的反向代理端口 (3001) 与后端实际监听端口不一致。已将后端默认端口修改为 3001 以匹配 Nginx 配置。请确保后端服务已成功启动且没有报错。

### 术语表
*   **Hangul**: 韩语字母表。
*   **Monorepo**: 单体仓库，在一个 Git 仓库中管理多个项目（前端和后端）。
*   **NestJS**: 一个用于构建高效、可扩展 Node.js 服务端应用程序的框架。
