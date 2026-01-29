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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourcesController = void 0;
const common_1 = require("@nestjs/common");
const resources_service_1 = require("./resources.service");
const resource_dto_1 = require("./dto/resource.dto");
const supabase_guard_1 = require("../auth/supabase.guard");
let ResourcesController = class ResourcesController {
    constructor(resourcesService) {
        this.resourcesService = resourcesService;
    }
    create(req, createResourceDto) {
        const userId = req.user.id;
        const token = req.token;
        return this.resourcesService.create(createResourceDto, userId, token);
    }
    findAll() {
        return this.resourcesService.findAll();
    }
    findOne(id) {
        return this.resourcesService.findOne(id);
    }
    update(req, id, updateResourceDto) {
        const userId = req.user.id;
        const token = req.token;
        return this.resourcesService.update(id, updateResourceDto, userId, token);
    }
    remove(req, id) {
        const token = req.token;
        return this.resourcesService.remove(id, token);
    }
};
exports.ResourcesController = ResourcesController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(supabase_guard_1.SupabaseGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, resource_dto_1.CreateResourceDto]),
    __metadata("design:returntype", void 0)
], ResourcesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ResourcesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ResourcesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(supabase_guard_1.SupabaseGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, resource_dto_1.UpdateResourceDto]),
    __metadata("design:returntype", void 0)
], ResourcesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(supabase_guard_1.SupabaseGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ResourcesController.prototype, "remove", null);
exports.ResourcesController = ResourcesController = __decorate([
    (0, common_1.Controller)('resources'),
    __metadata("design:paramtypes", [resources_service_1.ResourcesService])
], ResourcesController);
//# sourceMappingURL=resources.controller.js.map