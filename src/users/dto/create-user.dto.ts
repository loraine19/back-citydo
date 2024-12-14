import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateUserDto {
    @ApiProperty()
    @IsEmail()
    @IsNotEmpty({ message: 'Email is required' })
    @IsString()
    email: string;

    @ApiProperty()
    @IsNotEmpty({ message: 'password is required' })
    @IsString()
    @MinLength(6)
    password: string;
}  