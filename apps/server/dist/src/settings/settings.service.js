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
exports.SettingsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const supabase_service_1 = require("../supabase/supabase.service");
let SettingsService = class SettingsService {
    constructor(configService, supabaseService) {
        this.configService = configService;
        this.supabaseService = supabaseService;
    }
    async getApiKey() {
        try {
            const { data, error } = await this.supabaseService
                .getClient()
                .from('system_settings')
                .select('value')
                .eq('key', 'deepseek_api_key')
                .single();
            if (data && data.value) {
                return data.value;
            }
        }
        catch (e) {
            console.warn('Failed to fetch API key from DB:', e.message);
        }
        return this.configService.get('DEEPSEEK_API_KEY') || null;
    }
    async setApiKey(apiKey) {
        const { error } = await this.supabaseService
            .getClient()
            .from('system_settings')
            .upsert({ key: 'deepseek_api_key', value: apiKey }, { onConflict: 'key' });
        if (error) {
            console.error('Error saving API key:', error);
            throw new common_1.InternalServerErrorException('Failed to save API key');
        }
    }
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        supabase_service_1.SupabaseService])
], SettingsService);
//# sourceMappingURL=settings.service.js.map