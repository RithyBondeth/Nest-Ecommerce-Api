import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl, Matches, MaxLength, MinLength } from "class-validator"
import { UserRoles } from "src/entities /user.entity"

export class AuthRegisterDTO {  
    @IsString()
    @IsNotEmpty()
    username: string

    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    @MinLength(8, { message: "Password must be at least 8 characters" })
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/, { message: "Password must contain at least one letter and one number" })
    password: string   

    @IsUrl()
    @IsOptional()
    avatarUrl?: string

    @IsEnum(UserRoles, { message: "Role must be either admin or user" })
    @IsOptional()
    role?: UserRoles
}