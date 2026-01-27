-- 插入测试用户 (如果不存在)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'admin@example.com', crypt('password123', gen_salt('bf')), NOW(), '{"provider":"email","providers":["email"]}', '{"name":"Admin User"}', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.users (id, email, name, password_hash, role)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'admin@example.com', 'Admin User', 'MANAGED_BY_SUPABASE', 'admin')
ON CONFLICT (email) DO NOTHING;

-- 插入测试资源
INSERT INTO public.resources (title, type, category, description, content, thumbnail, difficulty, creator_id)
VALUES 
  ('Korean Alphabet (Hangul) Basics', 'video', 'Basics', 'Learn the basics of Hangul in 20 minutes.', 'https://www.youtube.com/embed/s5aobqyEaMQ', 'https://img.youtube.com/vi/s5aobqyEaMQ/maxresdefault.jpg', 'beginner', '11111111-1111-1111-1111-111111111111'),
  ('Essential Korean Phrases', 'article', 'Vocabulary', 'Top 100 phrases you need to know.', '# Essential Phrases\n\n1. Hello - Annyeonghaseyo...', NULL, 'beginner', '11111111-1111-1111-1111-111111111111')
ON CONFLICT DO NOTHING;
