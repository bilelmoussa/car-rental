"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_company_owner_dto_1 = require("./create-company-owner-dto");
class UpdateUserDto extends (0, mapped_types_1.PartialType)(create_company_owner_dto_1.CreateCompanyOwner) {
}
exports.UpdateUserDto = UpdateUserDto;
//# sourceMappingURL=update-user-dto.js.map