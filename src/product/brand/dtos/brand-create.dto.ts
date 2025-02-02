import { IsLowercase, IsNotEmpty, IsString } from "class-validator";

export class CreateBrandDTO {
    @IsString()
    @IsLowercase({ message: "Brand name must be in lowercase" })
    @IsNotEmpty()
    name: string
}