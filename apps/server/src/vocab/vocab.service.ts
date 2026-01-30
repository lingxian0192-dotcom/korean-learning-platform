import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

export interface CreateVocabDto {
  content: string;
  definition?: string;
  type?: 'word' | 'phrase' | 'sentence' | 'pattern';
  tags?: string[];
}

@Injectable()
export class VocabService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async create(userId: string, dto: CreateVocabDto) {
    // 1. Check limit
    const { count, error: countError } = await this.supabaseService
      .getClient()
      .from('vocab_items')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (countError) throw new BadRequestException(countError.message);
    if (count >= 20000) {
      throw new BadRequestException('Vocabulary limit reached (20,000 items)');
    }

    // 2. Insert
    const { data, error } = await this.supabaseService
      .getClient()
      .from('vocab_items')
      .insert({
        user_id: userId,
        ...dto
      })
      .select()
      .single();

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async findAll(userId: string, query?: { search?: string; type?: string; tag?: string }) {
    let q = this.supabaseService
      .getClient()
      .from('vocab_items')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (query?.search) {
      q = q.or(`content.ilike.%${query.search}%,definition.ilike.%${query.search}%`);
    }
    if (query?.type) {
      q = q.eq('type', query.type);
    }
    if (query?.tag) {
      q = q.contains('tags', [query.tag]);
    }

    const { data, error } = await q;
    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async findOne(userId: string, id: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('vocab_items')
      .select('*')
      .eq('user_id', userId)
      .eq('id', id)
      .single();
    
    if (error || !data) throw new NotFoundException('Item not found');
    return data;
  }

  async update(userId: string, id: string, dto: Partial<CreateVocabDto>) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('vocab_items')
      .update(dto)
      .eq('user_id', userId)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async remove(userId: string, id: string) {
    const { error } = await this.supabaseService
      .getClient()
      .from('vocab_items')
      .delete()
      .eq('user_id', userId)
      .eq('id', id);

    if (error) throw new BadRequestException(error.message);
    return { success: true };
  }
}
