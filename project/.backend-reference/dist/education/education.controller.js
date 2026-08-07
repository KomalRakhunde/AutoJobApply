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
exports.EducationController = void 0;
const common_1 = require("@nestjs/common");
const education_service_1 = require("./education.service");
const create_education_dto_1 = require("./dto/create-education.dto");
const update_education_dto_1 = require("./dto/update-education.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let EducationController = class EducationController {
    educationService;
    constructor(educationService) {
        this.educationService = educationService;
    }
    create(userId, dto) {
        return this.educationService.create(userId, dto);
    }
    findAll(userId) {
        return this.educationService.findAll(userId);
    }
    update(id, dto) {
        return this.educationService.update(id, dto);
    }
    remove(id) {
        return this.educationService.remove(id);
    }
};
exports.EducationController = EducationController;
__decorate([
    (0, common_1.Post)(':userId'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_education_dto_1.CreateEducationDto]),
    __metadata("design:returntype", void 0)
], EducationController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EducationController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_education_dto_1.UpdateEducationDto]),
    __metadata("design:returntype", void 0)
], EducationController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EducationController.prototype, "remove", null);
exports.EducationController = EducationController = __decorate([
    (0, common_1.Controller)('education'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [education_service_1.EducationService])
], EducationController);
//# sourceMappingURL=education.controller.js.map