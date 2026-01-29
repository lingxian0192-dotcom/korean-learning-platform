# 应急响应方案

## 1. 常见故障处理流程

### 1.1 网站无法访问 (502/503)
1.  **检查部署状态**: 登录 Netlify/Vercel 控制台，查看最新 Deployment 是否失败。
    - *动作*: 若失败，点击 "Revert to previous deploy" 一键回滚。
2.  **检查后端日志**: 查看 Serverless Function Logs。
    - *常见原因*: 数据库连接超时、环境变量丢失。
3.  **检查数据库**: 登录 Supabase Dashboard。
    - *指标*: CPU 使用率、内存使用率、连接数。
    - *动作*: 若连接数爆满，重启数据库或 Kill 闲置连接。

### 1.2 数据库连接失败
- **现象**: API 返回 500，日志显示 `FATAL: remaining connection slots are reserved for non-replication superuser connections`.
- **处理**:
  1.  立即检查应用是否使用了 Transaction Pooler (端口 6543)。
  2.  暂时停止非核心的后台任务 (如数据分析脚本)。
  3.  在 Supabase 后台执行 `SELECT pg_terminate_backend(pid) ...` 清理死锁进程。

### 1.3 数据误删除
- **场景**: 管理员误删除了重要资源。
- **恢复步骤**:
  1.  **停止写入**: 暂时开启系统维护模式。
  2.  **PITR 恢复**: 在 Supabase 后台使用 Point-in-Time Recovery (需付费版支持) 回滚到事故发生前的时间点。
  3.  **冷备恢复**: 若无 PITR，从本地最新的 `backup.sql` 恢复 (数据会回退到备份时间点)。

## 2. 关键联系人

| 角色 | 姓名 | 电话 | 邮箱 | 职责 |
| :--- | :--- | :--- | :--- | :--- |
| **技术负责人** | [Name] | +86-1xx-xxxx | tech@example.com | 重大架构决策、紧急事故指挥 |
| **运维工程师** | [Name] | +86-1xx-xxxx | ops@example.com | 服务器、数据库、网络故障处理 |
| **产品经理** | [Name] | +86-1xx-xxxx | pm@example.com | 业务影响评估、对外公告发布 |
