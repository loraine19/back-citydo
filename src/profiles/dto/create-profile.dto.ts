import { ApiProperty } from "@nestjs/swagger";
import { $Enums } from "@prisma/client";
import { Transform, Type } from "class-transformer";
import { IsString, IsNotEmpty, IsBoolean, IsEnum, IsNumber, IsArray, IsOptional } from "class-validator";

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

    @ApiProperty()
    @IsNotEmpty({ message: 'User id is required' })
    @Type(() => Number)
    @IsNumber({}, { message: 'User id must be a number' })
    userId: number;

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

    @ApiProperty({ type: 'boolean', required: false })
    @Transform(({ value }) => value === 'true' ? true : false)
    @IsBoolean({ message: 'AddressShared must be a boolean' })
    addressShared: boolean;

    @ApiProperty({ enum: $Enums.AssistanceLevel, required: false })
    @IsEnum($Enums.AssistanceLevel, { message: 'AssistanceLevel must be part of ' + Object.values($Enums.AssistanceLevel).join(', ') })
    assistance: $Enums.AssistanceLevel;

    @ApiProperty()
    @IsNotEmpty({ message: 'Address id is required' })
    @Type(() => Number)
    @IsNumber({}, { message: 'Address id must be a number' })
    points: number;

    @ApiProperty({ type: 'string', required: false })
    @IsOptional()
    @IsString({ message: 'Skills must be a string' })
    skills: string;
}
