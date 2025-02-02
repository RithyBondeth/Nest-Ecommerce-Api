import { IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class UpdateCartItemDto {
    @IsNumber()
    @IsPositive()
    @IsNotEmpty()
    quantity: number
}