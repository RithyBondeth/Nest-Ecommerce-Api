import { IsEnum, IsOptional, IsString } from "class-validator";
import { OrderStatus } from "src/entities /order.entity";

export class OrderFilterDto {
    @IsEnum(OrderStatus)
    @IsOptional()
    status?: OrderStatus   

    @IsString()
    @IsOptional()
    username?: string
}