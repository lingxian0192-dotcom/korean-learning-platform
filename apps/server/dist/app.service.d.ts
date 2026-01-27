import { SupabaseService } from './supabase/supabase.service';
export declare class AppService {
    private readonly supabaseService;
    constructor(supabaseService: SupabaseService);
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
}
