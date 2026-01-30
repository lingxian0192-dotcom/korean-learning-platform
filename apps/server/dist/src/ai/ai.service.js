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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const supabase_service_1 = require("../supabase/supabase.service");
const axios_1 = __importDefault(require("axios"));
let AiService = class AiService {
    constructor(configService, supabaseService) {
        this.configService = configService;
        this.supabaseService = supabaseService;
        this.deepSeekUrl = 'https://api.deepseek.com/chat/completions';
        this.systemPrompt = `
You are a dedicated Korean language learning assistant for LingKR HUB.
Your role is to help users learn Korean vocabulary, grammar, pronunciation, and culture.
Rules:
1. ONLY answer questions related to Korean language learning.
2. If a user asks about coding, math, general knowledge, or anything else, politely refuse in Korean and English, saying "I can only help with Korean learning."
3. Be encouraging and helpful.
4. Provide examples in Hangul and Romanization if needed.
`;
    }
    async chat(userId, message) {
        const apiKey = this.configService.get('DEEPSEEK_API_KEY');
        if (!apiKey) {
            return {
                content: "DeepSeek API Key is missing. Please configure DEEPSEEK_API_KEY in the server environment. (Mock Response: 안녕하세요! How can I help you with Korean today?)"
            };
        }
        try {
            const response = await axios_1.default.post(this.deepSeekUrl, {
                model: 'deepseek-chat',
                messages: [
                    { role: 'system', content: this.systemPrompt },
                    { role: 'user', content: message }
                ],
                temperature: 0.7,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
            });
            const reply = response.data.choices[0].message.content;
            const tokens = response.data.usage?.total_tokens || 0;
            await this.supabaseService
                .getClient()
                .from('api_usage_logs')
                .insert({
                user_id: userId,
                tokens_used: tokens,
                endpoint: 'chat',
            });
            return { content: reply };
        }
        catch (error) {
            console.error('AI Service Error:', error.response?.data || error.message);
            throw new common_1.InternalServerErrorException('Failed to communicate with AI service');
        }
    }
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        supabase_service_1.SupabaseService])
], AiService);
//# sourceMappingURL=ai.service.js.map