import { IsEnum, IsNumber, IsOptional, IsPositive } from "class-validator";
import { UserRoles } from "src/entities /user.entity";

export class UserFilterDTO {
    @IsNumber()
    @IsPositive()
    @IsOptional()
    skip?: number

    @IsNumber()
    @IsPositive()
    @IsOptional()
    limit?: number

    @IsEnum(UserRoles)
    @IsOptional()
    role?: UserRoles
}