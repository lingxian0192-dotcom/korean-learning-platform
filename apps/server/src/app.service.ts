import { Injectable } from '@nestjs/common';
import { SupabaseService } from './supabase/supabase.service';

@Injectable()
export class AppService {
  constructor(private readonly supabaseService: SupabaseService) {}

  getHello(): string {
    return 'Hello World from NestJS!';
  }

  async getHealth() {
    const { count, error } = await this.supabaseService
      .getClient()
      .from('users')
      .select('*', { count: 'exact', head: true });

    if (error) {
      return { status: 'Error', error: error.message };
    }
    return { status: 'OK', database: 'Connected', userCount: count };
  }
}
