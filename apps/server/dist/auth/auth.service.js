"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../supabase/supabase.service");
let AuthService = class AuthService {
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
    }
    async signUp(authDto) {
        const { email, password, name } = authDto;
        const { data, error } = await this.supabaseService
            .getClient()
            .auth.signUp({
            email,
            password,
            options: {
                data: { name },
            },
        });
        if (error) {
            throw new common_1.UnauthorizedException(error.message);
        }
        if (data.user) {
            const { error: dbError } = await this.supabaseService
                .getClient()
                .from('users')
                .insert({
                id: data.user.id,
                email: data.user.email,
                name: name || 'User',
                password_hash: 'MANAGED_BY_SUPABASE',
            })
                .select()
                .single();
        }
        return { message: 'User registered successfully', user: data.user };
    }
    async signIn(authDto) {
        const { email, password } = authDto;
        const { data, error } = await this.supabaseService
            .getClient()
            .auth.signInWithPassword({
            email,
            password,
        });
        if (error) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return {
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            user: data.user,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], AuthService);
//# sourceMappingURL=auth.service.js.map