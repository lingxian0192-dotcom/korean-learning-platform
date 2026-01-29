# 扩展与容量规划指南

## 1. 水平扩展方案 (Horizontal Scaling)

### 1.1 无状态计算层
本系统后端基于 Serverless 架构设计，天然支持水平扩展。
- **负载均衡**: 由云厂商 (Netlify/Vercel) 的 Edge Network 自动处理。流量会自动分发到最近的边缘节点或可用的函数实例。
- **自动扩容**: 当并发请求增加时，FaaS 平台会自动启动更多的函数实例来处理请求。无需人工干预。

### 1.2 静态资源层
- **CDN**: 前端静态文件 (JS/CSS/Images) 托管在 CDN 上，支持全球加速和无限并发读取。

## 2. 垂直扩展能力 (Vertical Scaling)

虽然 Serverless 主要依赖水平扩展，但在单实例性能上仍可调优：
- **内存配置**: 在 `netlify.toml` 或 Vercel 配置中，可调整函数的最大内存 (默认 1024MB，可升至 3008MB)。增加内存通常也会按比例分配更多 CPU 时间片。
- **执行时间**: 默认超时通常为 10s (Vercel Hobby) 或 26s (Netlify)。如需处理长任务，需申请提升配额或改为异步队列架构。

## 3. 数据库扩展策略

数据库是主要的状态瓶颈。

### 3.1 读写分离 (规划中)
- **主库 (Primary)**: 处理所有写操作 (INSERT/UPDATE/DELETE)。
- **只读副本 (Read Replicas)**: 处理读操作 (SELECT)。Supabase 允许添加只读副本以分担查询压力。

### 3.2 连接池 (Connection Pooling)
- **问题**: Serverless 函数频繁启动会导致数据库连接耗尽。
- **方案**: 强制使用 Supabase Transaction Pooler (端口 6543)。
- **配置**: 
  ```env
  # 必须使用连接池端口
  DATABASE_URL=postgres://[user]:[pass]@db.[ref].supabase.co:6543/postgres
  ```

## 4. 容量规划模型

### 4.1 QPS 增长预测
假设每个活跃用户平均每天产生 50 次 API 请求。
- **1,000 DAU**: ~0.6 QPS (峰值 ~5 QPS) -> 免费版轻松承载。
- **10,000 DAU**: ~6 QPS (峰值 ~50 QPS) -> 需关注数据库 CPU，建议升级至 Pro Plan ($25/mo)。
- **100,000 DAU**: ~60 QPS (峰值 ~500 QPS) -> 需引入 Redis 缓存层，数据库需启用读写分离。

### 4.2 存储扩容方案
- **数据库**: Supabase 免费版 500MB。
  - *策略*: 仅存储文本元数据。视频/大文件严禁存入数据库。
- **文件存储**: Supabase Storage 免费版 1GB。
  - *策略*: 仅存储头像、封面图。视频文件使用第三方托管 (Bilibili/YouTube)。

### 4.3 瓶颈分析
1.  **数据库连接数**: 最先遇到的瓶颈。必须使用 PgBouncer。
2.  **冷启动延迟**: Serverless 特有。
    - *优化*: 使用 esbuild 减小包体积；保持函数各种依赖的轻量化。
