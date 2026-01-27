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
exports.ProgressService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../supabase/supabase.service");
let ProgressService = class ProgressService {
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
    }
    async updateProgress(userId, resourceId, updateProgressDto) {
        const { data, error } = await this.supabaseService
            .getClient()
            .from('learning_progress')
            .upsert({
            user_id: userId,
            resource_id: resourceId,
            progress: updateProgressDto.progress,
            time_spent: updateProgressDto.time_spent || 0,
            last_accessed: new Date().toISOString(),
            completed: updateProgressDto.progress >= 100,
        }, { onConflict: 'user_id,resource_id' })
            .select()
            .single();
        if (error) {
            throw new Error(error.message);
        }
        return data;
    }
    async getProgress(userId, resourceId) {
        const { data, error } = await this.supabaseService
            .getClient()
            .from('learning_progress')
            .select('*')
            .eq('user_id', userId)
            .eq('resource_id', resourceId)
            .single();
        if (error && error.code !== 'PGRST116') {
            throw new Error(error.message);
        }
        return data || null;
    }
    async getUserProgress(userId) {
        const { data, error } = await this.supabaseService
            .getClient()
            .from('learning_progress')
            .select('*, resource:resources(*)')
            .eq('user_id', userId);
        if (error) {
            throw new Error(error.message);
        }
        return data;
    }
};
exports.ProgressService = ProgressService;
exports.ProgressService = ProgressService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], ProgressService);
//# sourceMappingURL=progress.service.js.map