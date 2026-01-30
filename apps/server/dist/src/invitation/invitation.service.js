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
exports.InvitationService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../supabase/supabase.service");
const uuid_1 = require("uuid");
let InvitationService = class InvitationService {
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
    }
    async generateCodes(count, createdBy) {
        const codes = Array.from({ length: count }, () => ({
            code: (0, uuid_1.v4)().substring(0, 8).toUpperCase(),
            created_by: createdBy,
            status: 'active',
        }));
        const { data, error } = await this.supabaseService
            .getClient()
            .from('invitation_codes')
            .insert(codes)
            .select();
        if (error)
            throw new common_1.BadRequestException(error.message);
        return data;
    }
    async validateCode(code) {
        const { data, error } = await this.supabaseService
            .getClient()
            .from('invitation_codes')
            .select('*')
            .eq('code', code)
            .single();
        if (error || !data)
            return { valid: false };
        return { valid: data.status === 'active', code: data };
    }
    async redeemCode(code, userId) {
        const validation = await this.validateCode(code);
        if (!validation.valid) {
            throw new common_1.BadRequestException('Invalid or used invitation code');
        }
        const { error: updateError } = await this.supabaseService
            .getClient()
            .from('invitation_codes')
            .update({
            status: 'used',
            used_by: userId,
            used_at: new Date().toISOString()
        })
            .eq('code', code);
        if (updateError)
            throw new common_1.BadRequestException('Failed to redeem code');
        const { error: profileError } = await this.supabaseService
            .getClient()
            .from('profiles')
            .update({ is_invited: true })
            .eq('id', userId);
        if (profileError)
            throw new common_1.BadRequestException('Failed to activate user');
        return { success: true };
    }
    async listCodes() {
        const { data, error } = await this.supabaseService
            .getClient()
            .from('invitation_codes')
            .select('*, profiles:used_by(id)');
        if (error)
            throw new common_1.BadRequestException(error.message);
        return data;
    }
};
exports.InvitationService = InvitationService;
exports.InvitationService = InvitationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], InvitationService);
//# sourceMappingURL=invitation.service.js.map