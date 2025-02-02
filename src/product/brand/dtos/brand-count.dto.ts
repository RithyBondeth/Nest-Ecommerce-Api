import { IsNumber, IsPositive } from "class-validator";

export class BrandCountDTO {
    @IsNumber()
    @IsPositive()
    totalCount: number

    constructor(totalCount: number) {
        this.totalCount = totalCount   
    }
}