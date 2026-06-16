import { IsEmail, IsNotEmpty, IsOptional, Matches, MinLength } from "class-validator";

export class SendMessageDto {
    @IsNotEmpty({ message: 'Number tidak boleh kosong' })
    number: string;

    @IsNotEmpty({ message: 'message tidak boleh kosong' })
    message: string;

    @IsNotEmpty({ message: 'instanceName tidak boleh kosong' })
    instanceName: string;
}


export class CreateMessageDto {

    @IsOptional()
    whatsappId?: string;

    @IsNotEmpty({ message: 'remoteJid tidak boleh kosong' })
    remoteJid: string;

    @IsOptional()
    pushName?: string;

    @IsNotEmpty({ message: 'content tidak boleh kosong' })
    content: string;

    @IsNotEmpty({ message: 'type tidak boleh kosong' })
    type: string;

    @IsNotEmpty({ message: 'status tidak boleh kosong' })
    status: string;
}