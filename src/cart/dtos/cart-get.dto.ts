import { Exclude, Expose, Type } from "class-transformer"
import { IsNotEmpty, IsNumber, IsPositive, IsString, ValidateNested } from "class-validator"
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

class CartItemDto {
    @IsNumber()
    @IsPositive()
    id: number
    
    @IsNumber()
    @IsPositive()
    quantity: number

    @Type(() => ProductDto)
    product: ProductDto

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

export class GetCartDTO {
    id: number

    @ValidateNested({ each: true })
    @Type(() => CartItemDto)
    cartItems: CartItemDto[]

    @Type(() => UserDto)
    user: UserDto

    @Expose()
    getCartTotalPrice() {
        return this.cartItems.reduce((total, item) => total + (item.quantity * Number(item.product.price)), 0)   
    }

    @Exclude()
    createdAt: Date

    @Exclude()
    updatedAt: Date

    constructor(partail: Partial<GetCartDTO>) {
        Object.assign(this, partail)
    }
}