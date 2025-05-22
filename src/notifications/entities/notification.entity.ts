import { ApiProperty } from "@nestjs/swagger";
import { $Enums, User } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsBoolean, IsEnum, IsJSON, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";


export class Notification {
    @ApiProperty()
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    userId?: number;

    @ApiProperty()
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    addressId?: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    description: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    link?: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEnum($Enums.NotificationLevel, { message: 'The status must be a part of ' + Object.values($Enums.NotificationType).join(', ') })
    level: $Enums.NotificationLevel;

    @ApiProperty()
    @IsNotEmpty()
    @IsEnum($Enums.NotificationType, { message: 'The status must be a part of ' + Object.values($Enums.NotificationType).join(', ') })
    type: $Enums.NotificationType;


    @ApiProperty()
    @IsOptional()
    @Transform(({ value }) => value === 'true' ? true : false)
    @IsBoolean()
    read?: boolean;

    @ApiProperty()
    @IsOptional()
    @Transform(({ value }) => typeof value === 'string' ? JSON.parse(value) : value)
    @IsJSON()
    data?: JSON;


    constructor(partial: Partial<Notification>) {
        Object.assign(this, partial);
    }
}

export class UserNotifInfo {
    id: number;
    email: string;
    Profile: { mailSub: $Enums.MailSubscriptions };
    constructor(partial: Partial<User & { Profile: { mailSub: $Enums.MailSubscriptions } }>) {
        Object.assign(this, partial);
    }

}