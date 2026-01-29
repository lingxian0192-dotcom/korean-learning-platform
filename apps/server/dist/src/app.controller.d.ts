import { ConfigService } from '@nestjs/config';
import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    private readonly configService;
    constructor(appService: AppService, configService: ConfigService);
    getHello(): string;
    getHealth(): Promise<{
        status: string;
        error: string;
        database?: undefined;
        userCount?: undefined;
    } | {
        status: string;
        database: string;
        userCount: number;
        error?: undefined;
    }>;
    debugEnv(): {
        status: string;
        env: {
            SUPABASE_URL: string;
            SUPABASE_KEY_SET: boolean;
            SUPABASE_KEY_ROLE: string;
            PORT: string;
        };
    };
}
