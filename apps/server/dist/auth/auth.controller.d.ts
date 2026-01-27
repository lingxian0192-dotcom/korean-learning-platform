import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(authDto: AuthDto): Promise<{
        message: string;
        user: import("@supabase/auth-js").User;
    }>;
    login(authDto: AuthDto): Promise<{
        access_token: string;
        refresh_token: string;
        user: import("@supabase/auth-js").User;
    }>;
}
