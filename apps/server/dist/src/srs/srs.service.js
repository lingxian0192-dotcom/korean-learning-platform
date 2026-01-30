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
exports.SrsService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../supabase/supabase.service");
let SrsService = class SrsService {
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
        this.intervals = [0, 1, 3, 7, 14, 30, 60, 90, 180, 360];
    }
    async getDueItems(userId) {
        const { data, error } = await this.supabaseService
            .getClient()
            .from('study_reviews')
            .select('*, vocab_items!inner(*)')
            .eq('user_id', userId)
            .lte('next_review_at', new Date().toISOString())
            .order('next_review_at', { ascending: true });
        if (error)
            throw new common_1.BadRequestException(error.message);
        return data;
    }
    async reviewItem(userId, vocabId, quality) {
        const { data: current, error: fetchError } = await this.supabaseService
            .getClient()
            .from('study_reviews')
            .select('*')
            .eq('user_id', userId)
            .eq('vocab_id', vocabId)
            .single();
        let stage = current?.stage || 0;
        if (quality < 3) {
            stage = 0;
        }
        else {
            stage = Math.min(stage + 1, this.intervals.length - 1);
        }
        const daysToAdd = this.intervals[stage];
        const nextReview = new Date();
        nextReview.setDate(nextReview.getDate() + daysToAdd);
        const payload = {
            user_id: userId,
            vocab_id: vocabId,
            stage,
            next_review_at: nextReview.toISOString(),
            last_reviewed_at: new Date().toISOString(),
        };
        const { data, error } = await this.supabaseService
            .getClient()
            .from('study_reviews')
            .upsert(payload, { onConflict: 'vocab_id,user_id' })
            .select()
            .single();
        if (error)
            throw new common_1.BadRequestException(error.message);
        return data;
    }
    async addItemsToReview(userId, vocabIds) {
        const payload = vocabIds.map(vid => ({
            user_id: userId,
            vocab_id: vid,
            stage: 0,
            next_review_at: new Date().toISOString()
        }));
        const { data, error } = await this.supabaseService.getClient()
            .from('study_reviews')
            .upsert(payload, { onConflict: 'vocab_id,user_id' })
            .select();
        if (error)
            throw new common_1.BadRequestException(error.message);
        return data;
    }
};
exports.SrsService = SrsService;
exports.SrsService = SrsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], SrsService);
//# sourceMappingURL=srs.service.js.map