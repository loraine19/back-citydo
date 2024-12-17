import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { $Enums, Service } from "@prisma/client";

export class ServiceEntity implements Service {
    @ApiProperty()
    @IsNotEmpty({ message: 'id is required' })
    @IsNumber()
    id: number;

    @ApiProperty()
    @IsDate()
    createdAt: Date;

    @ApiProperty()
    @IsDate()
    updatedAt: Date;

    ///FOR DTO

    @ApiProperty()
    @IsNotEmpty({ message: 'user id is required' })
    @IsNumber()
    userId: number;

    @ApiProperty()
    @IsNumber()
    userIdResp: number;

    @ApiProperty()
    @IsNotEmpty({ message: 'Type is required' })
    @IsEnum($Enums.ServiceType, { message: 'Type must be part of ' + $Enums.ServiceType })
    type: $Enums.ServiceType;

    @ApiProperty()
    @IsNotEmpty({ message: 'title is required' })
    @IsString()
    title: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'description is required' })
    @IsString()
    description: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'category is required' })
    @IsEnum($Enums.ServiceCategory, { message: 'category must be part of ' + $Enums.ServiceCategory })
    category: $Enums.ServiceCategory;

    @ApiProperty()
    @IsNotEmpty({ message: 'skill is required' })
    @IsEnum($Enums.SkillLevel, { message: 'skill must be part of ' + $Enums.SkillLevel })
    skill: $Enums.SkillLevel;

    @ApiProperty()
    @IsNotEmpty({ message: 'hard is required' })
    @IsEnum($Enums.HardLevel, { message: 'hard must be part of ' + $Enums.HardLevel })
    hard: $Enums.HardLevel;

    @ApiProperty()
    @IsNotEmpty({ message: 'is required' })
    @IsEnum($Enums.ServiceStatus, { message: 'status must be part of ' + $Enums.ServiceStatus })
    status: $Enums.ServiceStatus;

    @ApiProperty()
    @IsOptional()
    @IsString()
    image: Uint8Array<ArrayBufferLike>;
}