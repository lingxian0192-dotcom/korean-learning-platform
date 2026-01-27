-- 用户表
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  avatar TEXT,
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'creator', 'admin')),
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 资源表
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('video', 'article', 'audio', 'interactive')),
  category VARCHAR(50) NOT NULL,
  description TEXT,
  content TEXT,
  thumbnail TEXT,
  metadata JSONB DEFAULT '{}',
  difficulty VARCHAR(20) CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  creator_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 学习进度表
CREATE TABLE learning_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
  progress FLOAT DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  time_spent INTEGER DEFAULT 0,
  notes JSONB DEFAULT '[]',
  completed BOOLEAN DEFAULT FALSE,
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, resource_id)
);

-- 插件表
CREATE TABLE plugins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  version VARCHAR(20) NOT NULL,
  type VARCHAR(50) NOT NULL,
  config_schema JSONB DEFAULT '{}',
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 用户插件关系表
CREATE TABLE user_plugins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  plugin_id UUID REFERENCES plugins(id) ON DELETE CASCADE,
  config JSONB DEFAULT '{}',
  enabled BOOLEAN DEFAULT TRUE,
  installed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, plugin_id)
);

-- 创建索引
CREATE INDEX idx_resources_type ON resources(type);
CREATE INDEX idx_resources_category ON resources(category);
CREATE INDEX idx_resources_difficulty ON resources(difficulty);
CREATE INDEX idx_learning_progress_user_id ON learning_progress(user_id);
CREATE INDEX idx_learning_progress_resource_id ON learning_progress(resource_id);
CREATE INDEX idx_user_plugins_user_id ON user_plugins(user_id);

-- Supabase RLS策略
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_plugins ENABLE ROW LEVEL SECURITY;

-- 用户只能查看自己的数据
CREATE POLICY users_read_own ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY users_update_own ON users FOR UPDATE USING (auth.uid() = id);

-- 资源读取权限
CREATE POLICY resources_read_all ON resources FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY resources_create_auth ON resources FOR INSERT TO authenticated WITH CHECK (auth.uid() = creator_id);
CREATE POLICY resources_update_own ON resources FOR UPDATE TO authenticated USING (auth.uid() = creator_id);
CREATE POLICY resources_delete_own ON resources FOR DELETE TO authenticated USING (auth.uid() = creator_id);

-- 学习进度权限
CREATE POLICY learning_progress_read_own ON learning_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY learning_progress_update_own ON learning_progress FOR ALL USING (auth.uid() = user_id);
