import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateResourceDto, UpdateResourceDto } from './dto/resource.dto';

@Injectable()
export class ResourcesService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async create(createResourceDto: CreateResourceDto, userId: string, token?: string) {
    const { data, error } = await this.supabaseService
      .getClient(token)
      .from('resources')
      .insert({
        ...createResourceDto,
        creator_id: userId,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async findAll() {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('resources')
      .select('*');

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async findOne(id: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('resources')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new NotFoundException(`Resource with ID ${id} not found`);
    }

    return data;
  }

  async update(id: string, updateResourceDto: UpdateResourceDto, userId: string, token?: string) {
    // Check ownership or admin role (RLS handles this at DB level, but good to check here too if needed)
    // For now rely on RLS
    const { data, error } = await this.supabaseService
      .getClient(token)
      .from('resources')
      .update(updateResourceDto)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async remove(id: string, token?: string) {
    const { error } = await this.supabaseService
      .getClient(token)
      .from('resources')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }

    return { message: 'Resource deleted successfully' };
  }
}
