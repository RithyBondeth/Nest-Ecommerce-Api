import { IsLowercase, IsNotEmpty, IsString } from "class-validator";

export class CreateCategoryDTO {
    @IsString()
    @IsLowercase({ message: "category name must be in lowercase" })
    @IsNotEmpty()
    name: string    
}