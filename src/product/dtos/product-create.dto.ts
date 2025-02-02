import { IsArray, IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator"

export class CreateProductDTO {
    @IsString()
    @IsNotEmpty()
    name: string 
    
    @IsString()
    @IsNotEmpty()
    description: string

    @IsNumber()
    @IsPositive()
    price: number

    @IsNumber()
    @IsPositive()
    stock: number

    @IsString()
    @IsNotEmpty()
    category: string

    @IsString()
    @IsNotEmpty()
    brand: string

    @IsArray()
    @IsNotEmpty()
    @IsString({ each: true })
    images?: string[]
}