import { ConfigService } from '@nestjs/config';
import { SupabaseService } from '../supabase/supabase.service';
export declare class AiService {
    private readonly configService;
    private readonly supabaseService;
    private readonly deepSeekUrl;
    private readonly systemPrompt;
    constructor(configService: ConfigService, supabaseService: SupabaseService);
    chat(userId: string, message: string): Promise<{
        content: any;
    }>;
}
