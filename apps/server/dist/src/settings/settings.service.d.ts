import { ConfigService } from '@nestjs/config';
import { SupabaseService } from '../supabase/supabase.service';
export declare class SettingsService {
    private readonly configService;
    private readonly supabaseService;
    constructor(configService: ConfigService, supabaseService: SupabaseService);
    getApiKey(): Promise<string | null>;
    setApiKey(apiKey: string): Promise<void>;
}
