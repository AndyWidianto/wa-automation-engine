import { PartialType } from '@nestjs/swagger'; 
import { IsNotEmpty, IsEnum, IsOptional } from "class-validator";

export class CreateAutoreplyDto {
    @IsNotEmpty({ message: "field name is required" })
    name: string;

    @IsNotEmpty({ message: "field type is required" })
    @IsEnum(["keyword", "ai_rag"], { message: "type must be keyword or ai_rag" })
    type: "keyword" | "ai_rag";

    @IsOptional()
    isActive: "active" | "inactive" = "active";
    
    @IsOptional()
    replyContent: string;

    @IsOptional()
    aiPrompt: string;
}

// Gunakan PartialType agar semua field di CreateAutoreplyDto menjadi opsional (?)
export class UpdateAutoreplyDto extends PartialType(CreateAutoreplyDto) {}