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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const signup_dto_1 = require("../users/signup.dto");
const auth_service_1 = require("./auth.service");
const public_decorator_1 = require("../common/decorators/public.decorator");
const auth_dto_1 = require("./auth.dto");
const jwt_auth_guard_1 = require("./jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user-decorator");
const roles_guard_1 = require("./roles.guard");
const Role_1 = require("../users/Role");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async signUpB2b(signupData) {
        return await this.authService.signupB2b(signupData);
    }
    signIn(loginDto) {
        return this.authService.signIn(loginDto);
    }
    async refresh(refreshTokenDto) {
        return this.authService.refreshToken(refreshTokenDto);
    }
    async logout(userId) {
        return this.authService.logout(userId);
    }
    async logoutFromAllDevices(userId) {
        return this.authService.logoutFromAllDevices(userId);
    }
    async getProfile(user) {
        return { user };
    }
    async adminOnlyEndPoint() {
        return { message: 'This is admin only content' };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)("local/b2b/signup"),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, swagger_1.ApiOperation)({ summary: "Account signup (local)" }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: "Account successfully registred."
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: "Invalid input data!"
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [signup_dto_1.B2BSignUpDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signUpB2b", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)("local/signin"),
    (0, common_1.UsePipes)(common_1.ValidationPipe),
    (0, swagger_1.ApiOperation)({ summary: "Account signin (local)" }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: "User successfully signed in"
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.UNAUTHORIZED,
        description: "Authentication is required, or the provided credentials are invalid."
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signIn", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('refresh'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.RefreshTokenDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)('logout-all'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logoutFromAllDevices", null);
__decorate([
    (0, common_1.Get)('profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Get)('admin-only'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(Role_1.Role.SuperAdmin),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "adminOnlyEndPoint", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)("authentication"),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map