import { IsNotEmpty, IsOptional } from "class-validator";


export class NotificationMarkReadDto {
    @IsNotEmpty({ message: "ids is required" })
    ids: string[];
}