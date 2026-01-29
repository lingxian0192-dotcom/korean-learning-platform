import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService implements OnModuleInit {
  private client: SupabaseClient;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.client = createClient(
      this.configService.get<string>('SUPABASE_URL'),
      this.configService.get<string>('SUPABASE_KEY'),
    );
  }

  getClient(token?: string): SupabaseClient {
    if (token) {
      return createClient(
        this.configService.get<string>('SUPABASE_URL'),
        this.configService.get<string>('SUPABASE_KEY'),
        {
          global: {
            headers: { Authorization: `Bearer ${token}` },
          },
        },
      );
    }
    return this.client;
  }
}
