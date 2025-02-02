import { Exclude, Type } from "class-transformer"
import { IsEnum, IsNumber, IsPositive, ValidateNested } from "class-validator"
import { Order, OrderStatus } from "src/entities /order.entity"
import { UserRoles } from "src/entities /user.entity"

class UserDto {
    id: number
    username: string

    @Exclude()
    email: string
    @Exclude()
    password: string
    @Exclude()
    avatarUrl: string
    @Exclude()
    role: UserRoles
    @Exclude()
    createdAt: Date
    @Exclude()
    updatedAt: Date
}

class OrderItemsDto {
    @IsNumber()
    @IsPositive()
    id: number

    @IsNumber()
    @IsPositive()
    quantity: number

    @IsNumber()
    @IsPositive()
    orderItemTotalPrice: number

    @Exclude()
    createdAt: Date
    @Exclude()
    updatedAt: Date
}

export class GetOrderDto {
    @IsNumber()
    @IsPositive()
    id: number

    @IsEnum(OrderStatus)
    status: OrderStatus
    
    @IsNumber()
    @IsPositive()
    orderTotalPrice: number

    @Type(() => UserDto)
    user: UserDto

    @ValidateNested({ each: true })
    @Type(() => OrderItemsDto)
    orderItems: OrderItemsDto[]

    @Exclude()
    createdAt: Date
    @Exclude()
    updatedAt: Date

    constructor(partial: Partial<GetOrderDto>) {
        Object.assign(this, partial)
    }
}