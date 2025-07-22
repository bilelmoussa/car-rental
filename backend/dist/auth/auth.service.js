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
let AuthService = class AuthService {
    usersService;
    companyService;
    constructor(usersService, companyService) {
        this.usersService = usersService;
        this.companyService = companyService;
    }
    async signupB2b(dto) {
        const { firstName, lastName, email, gender, password, companyName, address, country, phoneNumber, } = dto;
        const emailInUse = await this.usersService.findByEmail(email);
        if (emailInUse) {
            throw new common_1.BadRequestException("User already exist!");
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
        return { user: newUser, company: newCompany };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        company_service_1.CompanyService])
], AuthService);
//# sourceMappingURL=auth.service.js.map