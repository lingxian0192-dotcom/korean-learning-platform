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
exports.ResourcesService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../supabase/supabase.service");
let ResourcesService = class ResourcesService {
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
    }
    async create(createResourceDto, userId, token) {
        const { data, error } = await this.supabaseService
            .getClient(token)
            .from('resources')
            .insert({
            ...createResourceDto,
            creator_id: userId,
        })
            .select()
            .single();
        if (error) {
            throw new Error(error.message);
        }
        return data;
    }
    async findAll() {
        const { data, error } = await this.supabaseService
            .getClient()
            .from('resources')
            .select('*');
        if (error) {
            throw new Error(error.message);
        }
        return data;
    }
    async findOne(id) {
        const { data, error } = await this.supabaseService
            .getClient()
            .from('resources')
            .select('*')
            .eq('id', id)
            .single();
        if (error) {
            throw new common_1.NotFoundException(`Resource with ID ${id} not found`);
        }
        return data;
    }
    async update(id, updateResourceDto, userId, token) {
        const { data, error } = await this.supabaseService
            .getClient(token)
            .from('resources')
            .update(updateResourceDto)
            .eq('id', id)
            .select()
            .single();
        if (error) {
            throw new Error(error.message);
        }
        return data;
    }
    async remove(id, token) {
        const { error } = await this.supabaseService
            .getClient(token)
            .from('resources')
            .delete()
            .eq('id', id);
        if (error) {
            throw new Error(error.message);
        }
        return { message: 'Resource deleted successfully' };
    }
};
exports.ResourcesService = ResourcesService;
exports.ResourcesService = ResourcesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], ResourcesService);
//# sourceMappingURL=resources.service.js.map