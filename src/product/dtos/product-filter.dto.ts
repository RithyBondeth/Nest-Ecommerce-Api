import { IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class ProductFilterDTO {
    @IsNumber()
    @IsPositive()
    @IsOptional()
    skip?: number
    
    @IsNumber()
    @IsPositive()
    @IsOptional()
    limit?: number 

    @IsString()
    @IsOptional()
    category?: string   

    @IsString()
    @IsOptional()
    brand?: string

    @IsNumber()
    @IsPositive()
    @IsOptional()
    minPrice?: number

    @IsNumber()
    @IsPositive()
    @IsOptional()
    maxPrice?: number
}