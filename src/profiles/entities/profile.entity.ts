import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { $Enums, Profile, Address } from '@prisma/client';
import { Transform, Type } from 'class-transformer';

export class ProfileEntity implements Profile {
    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    ///FOR DTO
    @ApiProperty()
    @IsNotEmpty({ message: 'First name is required' })
    @IsString({ message: 'First name must be a string' })
    firstName: string;

    @ApiProperty()
    @IsString({ message: 'Last name must be a string' })
    @IsNotEmpty({ message: 'Last name is required' })
    lastName: string;

    @ApiProperty({ type: 'number', required: false })
    @IsOptional()
    @Type(() => Number)
    @IsNumber({}, { message: 'User ID SP must be a number' })
    userIdSp: number;

    @ApiProperty()
    @IsNotEmpty({ message: 'User ID is required' })
    @Type(() => Number)
    @IsNumber({}, { message: 'User ID must be a number' })
    userId: number;

    @ApiProperty()
    @IsNotEmpty({ message: 'Address ID is required' })
    @Type(() => Number)
    @IsNumber({}, { message: 'Address ID must be a number' })
    addressId: number;

    @ApiProperty({ type: 'string', required: false })
    @IsString({ message: 'Phone must be a string' })
    phone: string;

    @ApiProperty({ type: 'string', format: 'binary', required: false })
    @IsOptional()
    @IsNotEmpty({ message: 'Image is required' })
    image: string;

    @ApiProperty({ type: 'boolean' })
    @IsBoolean({ message: 'Address shared must be a boolean' })
    addressShared: boolean

    @IsOptional()
    @ApiProperty({ enum: $Enums.MailSubscriptions, default: $Enums.MailSubscriptions.SUB_1, required: false })
    @IsEnum($Enums.MailSubscriptions, { message: 'must be part of ' + Object.values($Enums.MailSubscriptions).join(', ') })
    mailSub: $Enums.MailSubscriptions

    @ApiProperty({ enum: $Enums.AssistanceLevel })
    @IsEnum($Enums.AssistanceLevel, { message: 'Assistance level must be part of ' + Object.values($Enums.AssistanceLevel).join(', ') })
    assistance: $Enums.AssistanceLevel;

    @ApiProperty()
    @IsNotEmpty({ message: 'Points are required' })
    @Type(() => Number)
    @IsNumber({}, { message: 'Points must be a number' })
    points: number;

    @ApiProperty({ type: 'string', required: false })
    @IsArray({ message: 'Skills must be an array' })
    skills: string;


    @IsOptional()
    Address: Address

}
