import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

export class AuthLoginDTO {
    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    @MinLength(8, { message: "Password must be at least 8 characters" })
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/, { message: "Password must contain at least one letter and one number" })
    password: string
}