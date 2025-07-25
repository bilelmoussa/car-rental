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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const company_service_1 = require("../company/company.service");
const users_service_1 = require("../users/users.service");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
let AuthService = class AuthService {
    usersService;
    companyService;
    jwtService;
    configService;
    constructor(usersService, companyService, jwtService, configService) {
        this.usersService = usersService;
        this.companyService = companyService;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async signupB2b(dto) {
        const { firstName, lastName, email, gender, password, companyName, address, country, phoneNumber, } = dto;
        const emailInUse = await this.usersService.findByEmail(email);
        if (emailInUse) {
            throw new common_1.BadRequestException("User with this email already exists");
        }
        const newUser = await this.usersService.createCompanyOwnerUser({
            firstName,
            lastName,
            email,
            gender,
            password,
        });
        const newCompany = await this.companyService.createCompany({
            name: companyName,
            address,
            country,
            phoneNumber,
            owner: newUser
        });
        console.log(newCompany);
        const tokens = this.generateTokens(newUser);
        return tokens;
    }
    async signIn(loginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        await this.usersService.updateLastLogin(user.id);
        return this.generateTokens(user);
    }
    async refreshToken(refreshTokenDto) {
        const { refreshToken } = refreshTokenDto;
        const user = await this.usersService.findByRefreshToken(refreshToken);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        const isValidRefreshToken = await this.usersService.validateRefreshToken(user.id, refreshToken);
        if (!isValidRefreshToken) {
            throw new common_1.UnauthorizedException('Invalid or expired refresh token');
        }
        const tokens = await this.generateTokens(user);
        return {
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token
        };
    }
    async logout(userId) {
        await this.usersService.revokeRefreshToken(userId);
    }
    async logoutFromAllDevices(userId) {
        await this.usersService.revokeRefreshToken(userId);
    }
    async validateUser(email, password) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            return null;
        }
        const isPasswordValid = await this.usersService.validatePassword(password, user.password);
        if (!isPasswordValid) {
            return null;
        }
        return user;
    }
    async generateTokens(user) {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };
        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_SECRET'),
            expiresIn: this.configService.get('JWT_EXPIRATION', '15m'),
        });
        const refreshToken = this.usersService.generateRefreshToken();
        await this.usersService.updateRefreshToken(user.id, refreshToken);
        return {
            access_token: accessToken,
            refresh_token: refreshToken,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
            }
        };
    }
    async generateNewAccessToken(userId) {
        const user = await this.usersService.findById(userId);
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };
        return this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_SECRET'),
            expiresIn: this.configService.get('JWT_EXPIRATION', '15m'),
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        company_service_1.CompanyService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map