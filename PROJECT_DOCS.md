# 韩语学习平台 (Korean Learning Platform) 项目文档

## 1. 项目概况与进度回顾

### 1.1 项目目标
构建一个可扩展的、支持多语言的韩语学习平台，包含视频、文章等多种资源类型的管理与展示，以及用户学习进度的追踪。

### 1.2 完成情况对比

| 模块 | 功能点 | 状态 | 说明 |
| :--- | :--- | :--- | :--- |
| **基础设施** | 项目脚手架 (Monorepo) | ✅ 已完成 | 前后端分离架构 (NestJS + React) |
| | 数据库设计 | ✅ 已完成 | Users, Resources, Progress, Plugins 表结构已建立 |
| | 国际化 (i18n) | ✅ 已完成 | 支持中/英双语实时切换 |
| **用户系统** | 注册/登录 | ✅ 已完成 | 基于 Supabase Auth 和 JWT |
| | 用户状态管理 | ✅ 已完成 | 前端 Context + LocalStorage 持久化 |
| **资源系统** | 资源列表 API | ✅ 已完成 | 支持分页获取资源 |
| | 资源列表展示 | ✅ 已完成 | 响应式卡片布局，支持显示类型和难度 |
| | **资源详情页** | ✅ 已完成 | 支持视频播放 (YouTube iframe) 和文章渲染 (Markdown) |
| **学习系统** | **进度追踪** | ✅ 已完成 | 记录学习进度，支持手动标记“已完成” |
| | **个人中心** | ⚠️ 部分完成 | 可在资源详情页查看个人进度，独立页面待开发 |
| **管理系统** | **后台管理界面** | ✅ 已完成 | 简单的 CRUD 界面，支持增删改查资源 |
| **插件系统** | **插件架构** | ❌ **未完成** | 数据库表已建，核心逻辑待开发 |

---

## 2. 技术栈详解

本项目采用现代化的前后端分离架构，注重类型安全（TypeScript）和开发效率。

### 2.1 后端 (Backend) - `apps/server`
*   **核心框架**: [NestJS](https://nestjs.com/)
    *   *选择理由*: 提供了高度模块化的架构（Modules, Controllers, Services），类似 Angular 的依赖注入，适合构建企业级应用。
*   **数据库 & 认证**: [Supabase](https://supabase.com/)
    *   *选择理由*: 开源的 Firebase 替代品，提供 PostgreSQL 数据库、内置的身份验证系统（Auth）和行级安全策略（RLS）。
*   **语言**: TypeScript
    *   *选择理由*: 提供静态类型检查，减少运行时错误。
*   **配置管理**: `@nestjs/config`
    *   *作用*: 管理环境变量（如 Supabase URL/Key）。
*   **数据验证**: `class-validator` & `class-transformer`
    *   *作用*: 对 API 请求参数进行运行时验证（如确保 `progress` 是 0-100 的数字）。

### 2.2 前端 (Frontend) - `apps/client`
*   **核心库**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
    *   *选择理由*: React 是主流 UI 库，Vite 提供了极速的构建和热更新体验。
*   **样式方案**: [Tailwind CSS](https://tailwindcss.com/)
    *   *作用*: 原子化 CSS，无需编写复杂的 CSS 文件，快速构建响应式界面。
*   **状态与数据管理**:
    *   `@tanstack/react-query`: 处理服务端数据的获取、缓存和同步（如获取资源列表、学习进度）。
    *   `React Context API`: 处理全局应用状态（如用户登录状态 `AuthContext`）。
*   **路由**: `react-router-dom`
    *   *作用*: 管理单页应用（SPA）的页面跳转。
*   **国际化**: `i18next` & `react-i18next`
    *   *作用*: 管理多语言翻译资源，支持自动检测浏览器语言。
*   **表单处理**: `react-hook-form`
    *   *作用*: 高效处理表单验证（用于登录/注册页、资源管理页）。
*   **内容渲染**:
    *   `react-markdown`: 用于将后端的 Markdown 文本渲染为 HTML（用于文章类型资源）。
*   **图标库**: `lucide-react`
    *   *作用*: 提供统一风格的 SVG 图标。

---

## 3. 扩展内容与依赖列表

以下是项目中引入的关键扩展库（Extensions）：

### 后端依赖
1.  `@supabase/supabase-js`: Supabase 官方客户端，用于数据库操作和认证。
2.  `class-validator` / `class-transformer`: 用于 DTO（数据传输对象）的验证。

### 前端依赖
1.  `axios`: HTTP 客户端，配置了拦截器以自动处理 Token。
2.  `i18next-browser-languagedetector`: 自动检测用户浏览器语言设置。
3.  `react-markdown`: Markdown 渲染器，用于显示文章内容。
4.  `@tanstack/react-query`: 强大的异步数据状态管理。

---

## 4. 使用指南

### 4.1 访问地址
*   **前端页面**: [http://localhost:5173](http://localhost:5173)
    *   **首页**: `/` - 平台入口。
    *   **资源列表**: `/resources` - 浏览所有课程。
    *   **资源详情**: `/resources/:id` - 观看视频或阅读文章，并追踪进度。
    *   **登录/注册**: `/auth/login`, `/auth/register`。
    *   **后台管理**: `/admin/resources` - 管理员添加/修改课程资源。
*   **后端 API**: [http://localhost:3001/api/v1](http://localhost:3001/api/v1)
    *   健康检查: `/health`
    *   资源管理: `/resources` (CRUD)
    *   学习进度: `/progress`
    *   认证: `/auth`

### 4.2 后台管理操作指南
现在平台已内置了图形化的管理界面，无需直接操作数据库。

1.  **进入管理后台**:
    *   登录任意账号（演示模式下所有登录用户均可访问，生产环境需限制 `admin` 角色）。
    *   点击顶部导航栏的 "Resource Management" (或中文 "资源管理") 链接。
    *   或者直接访问: [http://localhost:5173/admin/resources](http://localhost:5173/admin/resources)

2.  **添加资源**:
    *   点击右上角 "Add New Resource"。
    *   填写表单：
        *   **Type**: 选择 Video 或 Article。
        *   **Content**: 如果是 Video，填入 YouTube Embed URL (例如 `https://www.youtube.com/embed/xyz`); 如果是 Article，填入 Markdown 文本。
    *   点击保存。

3.  **编辑/删除**:
    *   在列表中点击 "编辑" (✏️) 图标修改信息。
    *   点击 "删除" (🗑️) 图标移除资源。

### 4.3 常用测试账号
*   **管理员**: `admin@example.com` / `password123`
*   **普通用户**: 您可以在注册页面自行注册。

---

## 5. 部署指南 (Deployment Guide)

本项目的部署需要将前端和后端分别部署到不同的服务，或使用支持多服务的平台。

### 5.1 前端部署 (Frontend)
推荐使用 **Vercel** 进行部署（已添加 `vercel.json` 配置文件）。

1.  **准备**: 确保代码已推送到 GitHub/GitLab。
2.  **Vercel 操作**:
    *   在 Vercel 导入 `apps/client` 目录作为根目录。
    *   Build Command: `npm run build`
    *   Output Directory: `dist`
    *   **Environment Variables**:
        *   `VITE_API_URL`: 设置为您的后端生产环境地址 (例如 `https://your-backend.onrender.com/api/v1`)。

### 5.2 后端部署 (Backend)
推荐使用 **Render** 或 **Railway**，支持 Docker 部署（已添加 `Dockerfile`）。

1.  **准备**: 确保代码已推送到 GitHub/GitLab。
2.  **Render/Railway 操作**:
    *   选择 `apps/server` 目录作为根目录（如果支持 Monorepo），或者指定 Dockerfile 路径 `apps/server/Dockerfile`。
    *   **Environment Variables**:
        *   `SUPABASE_URL`: 您的 Supabase 项目 URL。
        *   `SUPABASE_KEY`: 您的 Supabase Service Role Key (或 Anon Key，视权限需求而定)。
        *   `PORT`: `3001` (或平台默认端口)。

### 5.3 数据库 (Database)
数据库使用的是 **Supabase**，它是云端托管的，因此**不需要**额外的部署步骤。只要在后端环境变量中配置正确的 URL 和 Key 即可连接。

---

## 6. 操作日志 (最新更新)

*   **2026-01-27**:
    *   ✨ **新增功能**: 实现了 `ResourceDetailPage`，支持视频播放和 Markdown 文章渲染。
    *   ✨ **新增功能**: 实现了后端 `ProgressModule` 和前端进度追踪逻辑。
    *   ✨ **新增功能**: 实现了 `ManageResourcesPage`，提供了可视化的资源 CRUD 操作界面。
    *   🚀 **部署准备**:
        *   为前端添加了 `vercel.json` 配置文件。
        *   为后端添加了 `Dockerfile`，支持容器化部署。
    *   📝 **文档**: 更新了 `PROJECT_DOCS.md`，新增了部署指南章节。
