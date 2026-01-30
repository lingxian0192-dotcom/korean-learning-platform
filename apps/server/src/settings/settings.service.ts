import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class SettingsService {
  constructor(
    private readonly configService: ConfigService,
    private readonly supabaseService: SupabaseService,
  ) {}

  async getApiKey(): Promise<string | null> {
    // 1. Try DB first
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .from('system_settings')
        .select('value')
        .eq('key', 'deepseek_api_key')
        .single();

      if (data && data.value) {
        return data.value;
      }
    } catch (e) {
      // Ignore DB errors (table might not exist yet) and fallback
      console.warn('Failed to fetch API key from DB:', e.message);
    }

    // 2. Fallback to Env
    return this.configService.get<string>('DEEPSEEK_API_KEY') || null;
  }

  async setApiKey(apiKey: string): Promise<void> {
    const { error } = await this.supabaseService
      .getClient()
      .from('system_settings')
      .upsert(
        { key: 'deepseek_api_key', value: apiKey },
        { onConflict: 'key' }
      );

    if (error) {
      console.error('Error saving API key:', error);
      throw new InternalServerErrorException('Failed to save API key');
    }
  }
}
