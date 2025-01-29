import { ApiProperty } from "@nestjs/swagger";
import { $Enums } from "@prisma/client";
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class CreateUserDto {
    @ApiProperty()
    @IsEmail({}, { message: 'Invalid email' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'password is required' })
    @IsString({ message: 'password must be a string' })
    @MinLength(6, { message: 'password must be at least 6 characters long' })
    password: string;

    @IsOptional()
    @ApiProperty({ enum: $Enums.UserStatus, default: $Enums.UserStatus.INACTIVE, required: false })
    @IsEnum($Enums.UserStatus, { message: 'must be part of ' + Object.values($Enums.UserStatus).join(', ') })
    status: $Enums.UserStatus

    @IsOptional()
    @ApiProperty({ enum: $Enums.MailSubscriptions, default: $Enums.MailSubscriptions.SUB_1, required: false })
    @IsEnum($Enums.MailSubscriptions, { message: 'must be part of ' + Object.values($Enums.MailSubscriptions).join(', ') })
    mailSub: $Enums.MailSubscriptions
}  
