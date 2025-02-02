import { IsEnum } from "class-validator";
import { OrderStatus } from "src/entities /order.entity";

export class OrderStatusDto {
    @IsEnum(OrderStatus)
    status: OrderStatus
}