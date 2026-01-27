## 7. 部署方案 (免费版/Serverless优化)

针对个人开发者在没有固定服务器资源的情况下，本架构经过特别优化，完全支持在 Netlify/Vercel 等平台的免费套餐上运行。

### 7.1 部署架构概览

| 组件 | 推荐服务商 (免费版) | 部署模式 | 关键配置 |
|------|-------------------|----------|----------|
| **前端** | Netlify / Vercel | 静态站点托管 (Static Site) | 构建命令: `npm run build`<br>输出目录: `dist` |
| **后端** | Vercel / Netlify | Serverless Functions | 需要使用 `@nestjs/platform-express` 配合 `serverless-http` 适配器将 NestJS 包装为单一函数入口 |
| **数据库** | Supabase | PostgreSQL (云端) | 免费版提供 500MB 数据库存储，对于个人学习平台完全足够 |
| **文件存储** | Supabase Storage | 对象存储 | 用于存储用户头像、封面图等 (免费版 1GB) |
| **视频托管** | Bilibili / YouTube | 第三方嵌入 | **强烈建议**：不要直接将视频文件上传到 Supabase 或 Git 仓库。请上传到视频网站，然后在平台中存储 `iframe` 或视频链接。 |

### 7.2 Serverless 适配指南

由于免费版托管平台通常基于 Serverless (无服务器) 架构，后端代码需要进行微调以适应 "冷启动" 和 "无状态" 特性：

1.  **NestJS 适配**:
    *   **入口文件改造**: 创建 `api/index.ts` (Vercel) 或 `netlify/functions/api.ts`，不再使用 `app.listen()`，而是导出处理函数。
    *   **保持轻量**: 避免在模块初始化时进行繁重的同步操作，以减少冷启动时间。

2.  **数据库连接管理**:
    *   Serverless 环境下，每次请求可能会创建新的数据库连接。
    *   **解决方案**: 使用 Supabase 提供的 Connection Pooling (连接池) URL (通常端口为 6543) 而非直接连接 URL，防止连接数耗尽。

3.  **功能限制与规避**:
    *   **Websockets**: 免费版 Serverless 通常不支持长连接。
        *   *替代方案*: 使用 Supabase Realtime 功能来实现简单的实时通知，或者使用轮询 (Polling)。
    *   **执行超时**: Vercel 免费版函数执行限制为 10秒。
        *   *策略*: 避免长时间运行的 AI 生成任务。如果 AI 响应较慢，采用前端流式读取 (Streaming) 或异步队列 (虽然队列通常需要额外服务，简单场景下建议直接流式返回)。

### 7.3 成本估算 (个人使用)

*   **计算 (Vercel/Netlify)**: 每月 100GB 流量 / 10万次请求 -> **免费** (个人使用通常远低于此限制)
*   **数据库 (Supabase)**: 500MB -> **免费** (足够存储数万条文本记录)
*   **AI API**: OpenAI/Anthropic -> **按量付费** (需自行申请 Key，这是唯一需要直接付费的地方)

**结论**: 该架构完全可以在零固定成本的情况下启动并长期运行。
