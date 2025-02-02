import { IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class AddItemToCartDto {
    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    productId: number

    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    quantity: number
}