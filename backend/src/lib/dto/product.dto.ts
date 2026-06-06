import { PartialType } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProductDto {

    @IsNotEmpty({ message: "name is required" })
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsNotEmpty({ message: "price is required" })
    @Transform(({ value }) => Number(value)) // 👈 Konversi teks "15000" menjadi angka 15000
    @IsNumber({}, { message: "price must be a number" }) // Pastikan ini IsNumber, bukan IsNotEmpty saja
    price: number;

    @IsNotEmpty({ message: "stock is required" })
    @Transform(({ value }) => Number(value)) // 👈 Konversi teks "50" menjadi angka 50
    @IsNumber({}, { message: "stock must be a number" })
    stock: number;

}


export class UpdateProductDto extends PartialType(CreateProductDto) { }