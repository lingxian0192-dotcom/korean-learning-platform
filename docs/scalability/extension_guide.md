# 模块化扩展规范

## 1. 插件开发标准

系统支持通过插件机制扩展功能，无需修改核心代码。

### 1.1 插件数据结构
所有插件需在 `plugins` 表中注册：
```sql
CREATE TABLE plugins (
  id UUID PRIMARY KEY,
  name VARCHAR(100), -- 插件唯一标识，如 "plugin-vocabulary-flashcards"
  version VARCHAR(20),
  type VARCHAR(50), -- 'ui_component' | 'backend_service'
  config_schema JSONB -- 配置项的 JSON Schema 定义
);
```

### 1.2 前端插件接入
1.  **组件开发**: 在 `apps/client/src/plugins/` 下创建插件目录。
2.  **注册**: 在 `PluginRegistry.ts` 中注册组件映射。
3.  **动态加载**: 系统根据 `user_plugins` 表中的配置，动态渲染已启用的插件组件。

### 1.3 数据库分库分表策略 (未来规划)

当单表数据量超过 1000 万行时，需考虑分片。
- **用户表 (users)**: 按 `user_id` 哈希分片。
- **日志表 (logs)**: 按时间 (年/月) 进行范围分区 (Range Partitioning)。Supabase/PostgreSQL 原生支持分区表。

## 2. API 接入规范

### 2.1 接口设计原则
- **RESTful**: 遵循标准 HTTP 动词 (GET, POST, PATCH, DELETE)。
- **版本控制**: URL 必须包含版本号，如 `/api/v1/resources`。
- **响应格式**:
  ```json
  {
    "data": { ... },     // 成功时返回的数据
    "error": null,       // 失败时的错误信息
    "meta": {            // 分页等元数据
      "page": 1,
      "total": 100
    }
  }
  ```

### 2.2 错误处理
统一使用 HTTP 状态码：
- `400`: 参数错误 (Bad Request)
- `401`: 未认证 (Unauthorized)
- `403`: 无权限 (Forbidden)
- `404`: 资源不存在 (Not Found)
- `500`: 服务器内部错误 (Internal Server Error)
