import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { UpdateProgressDto } from './dto/progress.dto';

@Injectable()
export class ProgressService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async updateProgress(userId: string, resourceId: string, updateProgressDto: UpdateProgressDto) {
    // Upsert progress
    const { data, error } = await this.supabaseService
      .getClient()
      .from('learning_progress')
      .upsert({
        user_id: userId,
        resource_id: resourceId,
        progress: updateProgressDto.progress,
        time_spent: updateProgressDto.time_spent || 0,
        last_accessed: new Date().toISOString(),
        completed: updateProgressDto.progress >= 100,
      }, { onConflict: 'user_id,resource_id' })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  async getProgress(userId: string, resourceId: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('learning_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('resource_id', resourceId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "Row not found" which is fine
       throw new Error(error.message);
    }
    return data || null;
  }

  async getUserProgress(userId: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('learning_progress')
      .select('*, resource:resources(*)')
      .eq('user_id', userId);

    if (error) {
      throw new Error(error.message);
    }
    return data;
  }
}
