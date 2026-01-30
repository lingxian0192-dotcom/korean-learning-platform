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
exports.VocabController = void 0;
const common_1 = require("@nestjs/common");
const vocab_service_1 = require("./vocab.service");
const supabase_guard_1 = require("../auth/supabase.guard");
const invited_guard_1 = require("../auth/invited.guard");
let VocabController = class VocabController {
    constructor(vocabService) {
        this.vocabService = vocabService;
    }
    create(req, dto) {
        return this.vocabService.create(req.user.id, dto);
    }
    findAll(req, query) {
        return this.vocabService.findAll(req.user.id, query);
    }
    findOne(req, id) {
        return this.vocabService.findOne(req.user.id, id);
    }
    update(req, id, dto) {
        return this.vocabService.update(req.user.id, id, dto);
    }
    remove(req, id) {
        return this.vocabService.remove(req.user.id, id);
    }
};
exports.VocabController = VocabController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], VocabController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], VocabController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], VocabController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], VocabController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], VocabController.prototype, "remove", null);
exports.VocabController = VocabController = __decorate([
    (0, common_1.Controller)('vocab'),
    (0, common_1.UseGuards)(supabase_guard_1.SupabaseGuard, invited_guard_1.InvitedGuard),
    __metadata("design:paramtypes", [vocab_service_1.VocabService])
], VocabController);
//# sourceMappingURL=vocab.controller.js.map