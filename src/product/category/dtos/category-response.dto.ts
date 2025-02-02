import { Exclude, Expose } from "class-transformer";
import { IsNumber, IsPositive } from "class-validator";

export class CategoryResponseDTO {
    @IsNumber()
    @IsPositive()
    id: number

    @Expose({ name: "category" })
    name: string

    @Exclude()
    createdAt: Date

    @Exclude()
    updatedAt: Date

    constructor(partial: Partial<CategoryResponseDTO>) {
        Object.assign(this, partial)
    }
}