import { SupabaseService } from '../supabase/supabase.service';
import { AuthDto } from './dto/auth.dto';
export declare class AuthService {
    private readonly supabaseService;
    constructor(supabaseService: SupabaseService);
    signUp(authDto: AuthDto): Promise<{
        message: string;
        user: import("@supabase/auth-js").User;
    }>;
    signIn(authDto: AuthDto): Promise<{
        access_token: string;
        refresh_token: string;
        user: import("@supabase/auth-js").User;
    }>;
}
