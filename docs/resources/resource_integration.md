# 完整资源整合文档

## 1. 管理员账号清单

> ⚠️ **安全警告**: 生产环境密码严禁明文记录于此。请使用 1Password / LastPass 等工具管理。以下仅为测试环境默认值。

| 系统/服务 | 访问地址 | 用户名/账号 | 默认密码/Key | 权限说明 |
| :--- | :--- | :--- | :--- | :--- |
| **App Admin** | `https://[app-url]/login` | `admin@example.com` | `password123` | 系统超级管理员 |
| **Supabase** | `https://supabase.com/dashboard` | `dev-team@company.com` | (见密码库) | 数据库与后端服务管理 |
| **Netlify** | `https://app.netlify.com` | `dev-ops@company.com` | (见密码库) | 部署与域名管理 |
| **GitHub** | `https://github.com/org/repo` | `ci-bot` | (见Token库) | CI/CD 自动部署账户 |

## 2. 代码仓库索引

| 仓库名称 | 地址 | 分支策略 | 说明 |
| :--- | :--- | :--- | :--- |
| **Monorepo** | `git@github.com:user/project.git` | `main`(产线), `dev`(开发) | 包含前端和后端所有代码 |

- **CI/CD 配置**: `.github/workflows/` (Actions) 或 `netlify.toml`
- **代码规范**: 详见根目录 `.eslintrc.js` 及 `CONTRIBUTING.md`

## 3. 数据库信息

- **连接字符串模板**:
  ```bash
  postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:[PORT]/postgres
  ```
- **ER 图**: 见 `docs/architecture/business_architecture.md` 中的实体关系描述。
- **备份策略**:
  - **自动备份**: Supabase 每日自动备份 (保留7天)。
  - **手动备份**: 
    ```bash
    supabase db dump > backup_$(date +%F).sql
    ```

## 4. 工具清单

| 工具名称 | 用途 | 版本 | 配置文件路径 | 文档链接 |
| :--- | :--- | :--- | :--- | :--- |
| **VS Code** | 开发 IDE | Latest | `.vscode/` | [官网](https://code.visualstudio.com/) |
| **Postman** | API 测试 | v10+ | `test/postman_collection.json` | [官网](https://www.postman.com/) |
| **Docker** | 容器化 | v24+ | `Dockerfile` | [官网](https://www.docker.com/) |
| **pnpm/npm** | 包管理 | v9+ | `package.json` | [官网](https://docs.npmjs.com/) |
