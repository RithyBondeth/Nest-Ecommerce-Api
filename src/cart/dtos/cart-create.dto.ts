import { Exclude, Type } from "class-transformer"
import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator"

class UserDto {
    @IsNumber()
    @IsPositive()
    id: number

    @IsString()
    @IsNotEmpty()
    username: string
}

export class CreateCartDto {
    @IsNumber()
    @IsPositive()
    id: number 

    @Type(() => UserDto)
    user: UserDto

    @Exclude()
    createdAt: Date 

    @Exclude()
    updatedAt: Date

    constructor(partail: Partial<CreateCartDto>) {
        Object.assign(this, partail)
    }
} 