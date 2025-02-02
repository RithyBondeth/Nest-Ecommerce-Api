import { IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class RemoveItemFromCartDto {
    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    cartItemId: number
}