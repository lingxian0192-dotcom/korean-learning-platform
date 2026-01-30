import { ConfigService } from '@nestjs/config';
import { SupabaseService } from '../supabase/supabase.service';
import { SettingsService } from '../settings/settings.service';
export declare class AiService {
    private readonly configService;
    private readonly supabaseService;
    private readonly settingsService;
    private readonly deepSeekUrl;
    private readonly systemPrompt;
    constructor(configService: ConfigService, supabaseService: SupabaseService, settingsService: SettingsService);
    chat(userId: string, message: string): Promise<{
        content: any;
    }>;
}
