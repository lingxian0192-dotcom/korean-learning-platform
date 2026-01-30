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
exports.SrsController = void 0;
const common_1 = require("@nestjs/common");
const srs_service_1 = require("./srs.service");
const supabase_guard_1 = require("../auth/supabase.guard");
const invited_guard_1 = require("../auth/invited.guard");
let SrsController = class SrsController {
    constructor(srsService) {
        this.srsService = srsService;
    }
    getDue(req) {
        return this.srsService.getDueItems(req.user.id);
    }
    review(req, body) {
        return this.srsService.reviewItem(req.user.id, body.vocabId, body.quality);
    }
    addToReview(req, body) {
        return this.srsService.addItemsToReview(req.user.id, body.vocabIds);
    }
};
exports.SrsController = SrsController;
__decorate([
    (0, common_1.Get)('due'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SrsController.prototype, "getDue", null);
__decorate([
    (0, common_1.Post)('review'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], SrsController.prototype, "review", null);
__decorate([
    (0, common_1.Post)('add'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], SrsController.prototype, "addToReview", null);
exports.SrsController = SrsController = __decorate([
    (0, common_1.Controller)('srs'),
    (0, common_1.UseGuards)(supabase_guard_1.SupabaseGuard, invited_guard_1.InvitedGuard),
    __metadata("design:paramtypes", [srs_service_1.SrsService])
], SrsController);
//# sourceMappingURL=srs.controller.js.map