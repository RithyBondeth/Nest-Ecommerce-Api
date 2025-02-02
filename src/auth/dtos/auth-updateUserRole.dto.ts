import { IsEnum } from "class-validator";
import { UserRoles } from "src/entities /user.entity";

export class UpdateUserRoleDTO {
    @IsEnum(UserRoles, { message: "Role must be either admin or user" }) 
    role: UserRoles
}