import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class SrsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  // Simplified Ebbinghaus Intervals (days)
  private readonly intervals = [0, 1, 3, 7, 14, 30, 60, 90, 180, 360];

  async getDueItems(userId: string) {
    // Join study_reviews with vocab_items
    const { data, error } = await this.supabaseService
      .getClient()
      .from('study_reviews')
      .select('*, vocab_items!inner(*)') // Inner join to ensure vocab exists
      .eq('user_id', userId)
      .lte('next_review_at', new Date().toISOString())
      .order('next_review_at', { ascending: true });

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async reviewItem(userId: string, vocabId: string, quality: number) {
    // quality: 0 (forgot), 1 (hard), 2 (good), 3 (easy) -> mapped to logic
    // Actually typically 0-5. Let's say:
    // < 3: Reset
    // >= 3: Advance

    // Get current state
    const { data: current, error: fetchError } = await this.supabaseService
      .getClient()
      .from('study_reviews')
      .select('*')
      .eq('user_id', userId)
      .eq('vocab_id', vocabId)
      .single();

    // If not exists, it's new
    let stage = current?.stage || 0;
    
    if (quality < 3) {
      stage = 0; // Reset
    } else {
      stage = Math.min(stage + 1, this.intervals.length - 1);
    }

    const daysToAdd = this.intervals[stage];
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + daysToAdd);

    const payload = {
      user_id: userId,
      vocab_id: vocabId,
      stage,
      next_review_at: nextReview.toISOString(),
      last_reviewed_at: new Date().toISOString(),
    };

    const { data, error } = await this.supabaseService
      .getClient()
      .from('study_reviews')
      .upsert(payload, { onConflict: 'vocab_id,user_id' })
      .select()
      .single();

    if (error) throw new BadRequestException(error.message);
    return data;
  }
  
  // Initialize items for review (add from vocab to srs)
  async addItemsToReview(userId: string, vocabIds: string[]) {
      // Create review entries with stage 0
      const payload = vocabIds.map(vid => ({
          user_id: userId,
          vocab_id: vid,
          stage: 0,
          next_review_at: new Date().toISOString() // Due immediately
      }));
      
      const { data, error } = await this.supabaseService.getClient()
        .from('study_reviews')
        .upsert(payload, { onConflict: 'vocab_id,user_id' }) // Ignore if exists? Or update?
        .select();
        
      if (error) throw new BadRequestException(error.message);
      return data;
  }
}
