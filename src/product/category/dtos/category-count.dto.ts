import { IsNumber, IsPositive } from "class-validator";

export class CategoryCountDTO {
    @IsNumber()
    @IsPositive()
    totalCount: number

    constructor(totalCount: number) {
        this.totalCount = totalCount   
    }
}