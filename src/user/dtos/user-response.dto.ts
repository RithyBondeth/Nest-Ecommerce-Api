import { Exclude } from "class-transformer"
import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUrl } from "class-validator"
import { UserRoles } from "src/entities /user.entity"

export class UserResponseDTO {
    @IsNumber()
    @IsPositive()
    id: number

    @IsString()
    usermame: string

    @IsEmail()
    email: string

    @Exclude()
    password: string

    @IsUrl()
    @IsOptional()
    avatarUrl?: string

    @IsEnum(UserRoles)
    userRole: UserRoles

    @Exclude()
    createdAt: Date

    @Exclude()
    updatedAt: Date

    constructor(partail: Partial<UserResponseDTO>) {
        Object.assign(this, partail)
    }
}