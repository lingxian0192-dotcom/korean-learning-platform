import { SupabaseService } from '../supabase/supabase.service';
export declare class InvitationService {
    private readonly supabaseService;
    constructor(supabaseService: SupabaseService);
    generateCodes(count: number, createdBy: string): Promise<any[]>;
    validateCode(code: string): Promise<{
        valid: boolean;
        code?: undefined;
    } | {
        valid: boolean;
        code: any;
    }>;
    redeemCode(code: string, userId: string): Promise<{
        success: boolean;
    }>;
    listCodes(): Promise<any[]>;
}
