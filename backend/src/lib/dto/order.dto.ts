import { PartialType } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";



export class CreateOrderDto {

    @IsNotEmpty({ message: ""})
    @IsNumber()
    totalPrice: number;

    @IsNotEmpty({ message: "quantity is required"})
    @IsNumber()
    quantity: number;

    @IsOptional()
    status: "pending" | "completed" | "cancelled" | "delivered";

    @IsOptional()
    details: string;
}

export class UpdateOrderDto extends PartialType(CreateOrderDto) {

}