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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./user.entity");
const bcrypt = require("bcrypt");
const Role_1 = require("./Role");
const crypto = require("crypto");
let UsersService = class UsersService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    hashData(data) {
        return bcrypt.hash(data, 12);
    }
    findAllUser() {
        return this.userRepository.find();
    }
    async findByEmail(email) {
        return await this.userRepository.findOne({
            where: { email },
            select: {
                id: true,
                email: true,
                password: true,
                role: true,
            }
        });
    }
    async createCompanyOwnerUser(createCompanyOwnerDto) {
        const { email, password } = createCompanyOwnerDto;
        const hashedPassword = await this.hashData(password);
        const newUser = this.userRepository.create({
            firstName: createCompanyOwnerDto.firstName,
            lastName: createCompanyOwnerDto.lastName,
            password: hashedPassword,
            email: email.toLowerCase(),
            gender: createCompanyOwnerDto.gender,
            role: Role_1.Role.CompanyOwner,
        });
        const savedUser = await this.userRepository.save(newUser);
        return savedUser;
    }
    async findById(id) {
        const user = await this.userRepository.findOne({
            where: { id }
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async findByRefreshToken(refreshToken) {
        const hashedToken = this.hashRefreshToken(refreshToken);
        return this.userRepository.findOne({
            where: {
                refreshToken: hashedToken,
            }
        });
    }
    async updateLastLogin(id) {
        await this.userRepository.update(id, {
            updatedAt: new Date(),
        });
    }
    async validatePassword(plainPassword, hashedPassword) {
        return bcrypt.compare(plainPassword, hashedPassword);
    }
    async updateRefreshToken(userId, refreshToken) {
        const updateData = {
            refreshToken: refreshToken ? this.hashRefreshToken(refreshToken) : null,
            refreshTokenExpiresAt: refreshToken ? this.getRefreshTokenExpiry() : null,
        };
        await this.userRepository.update(userId, updateData);
    }
    async validateRefreshToken(userId, refreshToken) {
        const user = await this.findById(userId);
        if (!user.refreshToken || !user.refreshTokenExpiresAt) {
            return false;
        }
        if (new Date() > user.refreshTokenExpiresAt) {
            await this.updateRefreshToken(userId, null);
            return false;
        }
        const hashedToken = this.hashRefreshToken(refreshToken);
        return user.refreshToken === hashedToken;
    }
    async revokeRefreshToken(userId) {
        await this.updateRefreshToken(userId, null);
    }
    hashRefreshToken(token) {
        return crypto.createHash('sha256').update(token).digest('hex');
    }
    getRefreshTokenExpiry() {
        const expiryDays = 7;
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + expiryDays);
        return expiry;
    }
    generateRefreshToken() {
        return crypto.randomBytes(64).toString('hex');
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map