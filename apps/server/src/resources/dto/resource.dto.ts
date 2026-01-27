export class CreateResourceDto {
  title: string;
  type: 'video' | 'article' | 'audio' | 'interactive';
  category: string;
  description?: string;
  content?: string;
  thumbnail?: string;
  metadata?: Record<string, any>;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export class UpdateResourceDto {
  title?: string;
  type?: 'video' | 'article' | 'audio' | 'interactive';
  category?: string;
  description?: string;
  content?: string;
  thumbnail?: string;
  metadata?: Record<string, any>;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}
