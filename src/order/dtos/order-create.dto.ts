import { Exclude, Type } from "class-transformer"
import { IsEnum, IsNotEmpty, IsNumber, IsPositive, IsString, ValidateNested } from "class-validator"
import { OrderStatus } from "src/entities /order.entity"
import { UserRoles } from "src/entities /user.entity"

class ProductDto {
    @IsNumber()
    @IsPositive()
    id: number

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

    @Type(() => ProductDto)
    product: ProductDto
    
    @IsNumber()
    @IsPositive()
    orderItemTotalPrice: number 

    @Exclude()
    createdAt: Date

    @Exclude()
    updatedAt: Date
}

class UserDto {
    @IsNumber()
    @IsPositive()
    id: number

    @IsString()
    @IsNotEmpty()
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

export class CreateOrderDto {
    @IsNumber()
    @IsPositive()
    id: number

    @IsEnum(OrderStatus)
    status: OrderStatus
    
    @ValidateNested({ each: true })
    @Type(() => OrderItemsDto) 
    orderItems: OrderItemsDto[]

    @Type(() => UserDto)
    user: UserDto

    @IsNumber()
    @IsPositive()
    orderTotalPrice: number

    @Exclude()
    createdAt: Date

    @Exclude()
    updatedAt: Date

    constructor(partial: Partial<CreateOrderDto>) {
        return Object.assign(this, partial)
    }
}