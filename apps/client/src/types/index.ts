export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'creator' | 'admin';
}

export interface Resource {
  id: string;
  title: string;
  type: 'video' | 'article' | 'audio' | 'interactive';
  category: string;
  description: string;
  content: string;
  thumbnail?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  created_at: string;
}
