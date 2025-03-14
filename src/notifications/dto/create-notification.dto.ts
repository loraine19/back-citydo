import { ApiProperty } from "@nestjs/swagger";
import { $Enums, Notification } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateNotificationDto implements Partial<Notification> {
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





}
