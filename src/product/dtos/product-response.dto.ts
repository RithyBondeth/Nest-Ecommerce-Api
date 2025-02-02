import { Exclude } from "class-transformer"
import { IsArray, IsInt, IsNumber, IsPositive, IsString } from "class-validator"

export class ProductResponseDTO {
    @IsNumber()
    @IsPositive()
    id: number

    @IsString()
    name: string

    @IsString()
    description: string

    @IsNumber()
    @IsPositive()
    price: number

    @IsInt()
    @IsPositive()
    stock: number

    @IsArray()
    images: string[]

    @Exclude()
    createdAt: Date

    @Exclude()
    updatedAt: Date

    @IsString()
    brand: string

    @IsString()
    category: string

    constructor(partail: Partial<ProductResponseDTO>) {
        Object.assign(this, partail)
    }
}