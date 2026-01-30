# 运维与维护指南

## 1. 文档更新机制
- **版本控制**: 文档与代码同源，存储在 git 仓库的 `docs/` 目录下。
- **更新触发**:
  - 每次架构变更 (Architecture Decision Record) 必须同步更新 `architecture/`。
  - 每次新增 API 必须同步更新 `extension_guide.md`。
- **责任人**:
  - 架构文档: Tech Lead
  - 业务文档: Product Manager
  - 运维文档: DevOps Engineer

## 2. 文档有效性验证
为防止文档“腐烂”，需定期执行以下验证：
1.  **链接检查**: 使用工具 (如 `markdown-link-check`) 扫描文档中的死链。
2.  **账号验证**: 每季度验证 `resource_integration.md` 中的测试账号是否可用。
3.  **恢复演练**: 每半年执行一次数据库备份恢复演练，验证 `emergency_response.md` 的有效性。

## 3. 新成员入职指引

欢迎加入团队！请按照以下顺序阅读文档以快速上手：

### 第一阶段：全局认知 (Day 1)
1.  **[业务功能架构](../architecture/business_architecture.md)**: 了解我们在做什么，有哪些核心功能。
2.  **[技术架构说明](../architecture/technical_architecture.md)**: 了解系统是如何搭建的，用了什么技术。

### 第二阶段：环境搭建 (Day 2)
1.  **[资源整合文档](../resources/resource_integration.md)**: 获取代码仓库权限、数据库连接串。
2.  参考 `README.md` 中的 "本地开发" 章节启动项目。

### 第三阶段：深入开发 (Day 3-5)
1.  **[模块化扩展规范](../scalability/extension_guide.md)**: 如果你需要开发新插件或 API。
2.  **[扩展与容量规划](../scalability/scaling_guide.md)**: 了解性能边界和最佳实践。

### 第四阶段：运维与应急 (按需)
1.  **[应急响应方案](emergency_response.md)**: 当你轮值 On-call 时必读。

## 4. 部署与发布

本项目采用 Docker 容器化部署方案，集成了 PM2 进行进程管理。

### 4.1 部署架构
- **Frontend**: Nginx 容器，负责静态资源托管与反向代理。
- **Backend**: Node.js 容器，内部运行 `pm2-runtime` 托管 NestJS 应用。
- **Orchestration**: 使用 Docker Compose 编排服务。

### 4.2 操作指南
所有部署脚本位于 `deploy/` 目录。
- **首次部署**: 运行 `./deploy/deploy.sh`，脚本会自动安装 Docker 环境并启动服务。
- **代码更新**: 拉取最新代码后，再次运行 `./deploy/deploy.sh` 即可自动重建并重启。
