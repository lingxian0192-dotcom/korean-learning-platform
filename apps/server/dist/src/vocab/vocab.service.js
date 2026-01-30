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
exports.VocabService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../supabase/supabase.service");
let VocabService = class VocabService {
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
    }
    async create(userId, dto) {
        const { count, error: countError } = await this.supabaseService
            .getClient()
            .from('vocab_items')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId);
        if (countError)
            throw new common_1.BadRequestException(countError.message);
        if (count >= 20000) {
            throw new common_1.BadRequestException('Vocabulary limit reached (20,000 items)');
        }
        const { data, error } = await this.supabaseService
            .getClient()
            .from('vocab_items')
            .insert({
            user_id: userId,
            ...dto
        })
            .select()
            .single();
        if (error)
            throw new common_1.BadRequestException(error.message);
        return data;
    }
    async findAll(userId, query) {
        let q = this.supabaseService
            .getClient()
            .from('vocab_items')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        if (query?.search) {
            q = q.or(`content.ilike.%${query.search}%,definition.ilike.%${query.search}%`);
        }
        if (query?.type) {
            q = q.eq('type', query.type);
        }
        if (query?.tag) {
            q = q.contains('tags', [query.tag]);
        }
        const { data, error } = await q;
        if (error)
            throw new common_1.BadRequestException(error.message);
        return data;
    }
    async findOne(userId, id) {
        const { data, error } = await this.supabaseService
            .getClient()
            .from('vocab_items')
            .select('*')
            .eq('user_id', userId)
            .eq('id', id)
            .single();
        if (error || !data)
            throw new common_1.NotFoundException('Item not found');
        return data;
    }
    async update(userId, id, dto) {
        const { data, error } = await this.supabaseService
            .getClient()
            .from('vocab_items')
            .update(dto)
            .eq('user_id', userId)
            .eq('id', id)
            .select()
            .single();
        if (error)
            throw new common_1.BadRequestException(error.message);
        return data;
    }
    async remove(userId, id) {
        const { error } = await this.supabaseService
            .getClient()
            .from('vocab_items')
            .delete()
            .eq('user_id', userId)
            .eq('id', id);
        if (error)
            throw new common_1.BadRequestException(error.message);
        return { success: true };
    }
};
exports.VocabService = VocabService;
exports.VocabService = VocabService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], VocabService);
//# sourceMappingURL=vocab.service.js.map