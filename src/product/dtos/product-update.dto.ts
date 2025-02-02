import { IsArray, IsNumber, IsOptional, IsPositive, IsString } from "class-validator"

export class UpdateProductDTO {
    @IsString()
    @IsOptional()
    name?: string

    @IsString()
    @IsOptional()
    description?: string

    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number

    @IsNumber()
    @IsPositive()
    @IsOptional()
    stock?: number

    @IsString()
    @IsOptional()
    category?: string

    @IsString()
    @IsOptional()
    brand?: string

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    images?: string[]
}