import { ApiProperty } from "@nestjs/swagger";
import { $Enums, Address } from "@prisma/client";
import { Transform, Type } from "class-transformer";
import { IsString, IsNotEmpty, IsBoolean, IsEnum, IsNumber, IsArray, IsOptional } from "class-validator";
import { CreateAddressDto } from "src/addresses/dto/create-address.dto";


export class CreateProfileDto {
    @ApiProperty()
    @IsNotEmpty({ message: 'First name is required' })
    @IsString({ message: 'First name must be a string' })
    firstName: string;

    @ApiProperty()
    @IsString({ message: 'Last name must be a string' })
    @IsNotEmpty({ message: 'Last name is required' })
    lastName: string;

    @ApiProperty({ type: 'number', required: false })
    @Type(() => Number)
    @IsOptional()
    @IsNumber({}, { message: 'User id sp must be a number' })
    userIdSp: number;

    @ApiProperty({ type: 'number', required: false })
    @IsOptional()
    @Type(() => Number)
    @IsNumber({}, { message: 'User id must be a number' })
    userId?: number;

    @ApiProperty()
    @IsNotEmpty({ message: 'Address id is required' })
    @Type(() => Number)
    @IsNumber({}, { message: 'Address id must be a number' })
    addressId: number;

    @ApiProperty({ type: 'string', required: false })
    @IsString({ message: 'Phone must be a string' })
    @Transform(({ value }) => typeof value === 'string' ? value : String(value))
    phone: string;

    @ApiProperty({ type: 'string', format: 'binary', required: false })
    @IsString({ message: 'Image must be a string' })
    @IsOptional()
    image: any;

    @ApiProperty({ default: false, type: 'boolean', required: false })
    @IsOptional()
    @Transform(({ value }) => value === 'true' ? true : false)
    @IsBoolean({ message: 'AddressShared must be a boolean' })
    addressShared: boolean;

    @IsOptional()
    @ApiProperty({ enum: $Enums.MailSubscriptions, default: $Enums.MailSubscriptions.SUB_1, required: false })
    @IsEnum($Enums.MailSubscriptions, { message: 'must be part of ' + Object.values($Enums.MailSubscriptions).join(', ') })
    mailSub: $Enums.MailSubscriptions

    @ApiProperty({ enum: $Enums.AssistanceLevel, required: false })
    @Transform(({ value }) => typeof (value) === 'string' && value.includes('LEVEL_') ? value : $Enums.AssistanceLevel[parseInt(value)])
    @IsEnum($Enums.AssistanceLevel, { message: 'AssistanceLevel must be part of ' + Object.values($Enums.AssistanceLevel).join(', ') })
    assistance: $Enums.AssistanceLevel;

    @ApiProperty()
    @IsOptional()
    @Type(() => Number)
    @IsNumber({}, { message: 'Address id must be a number' })
    points: number;

    @ApiProperty({ type: 'string', required: false })
    @IsOptional()
    @IsString({ message: 'Skills must be a string' })
    skills: string;

    @ApiProperty({ type: CreateAddressDto })
    Address: CreateAddressDto
}
