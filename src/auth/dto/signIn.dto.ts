import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignInDto {
  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  @ApiProperty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}

export class SignInVerifyDto extends SignInDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'VerifyToken is required' })
  verifyToken: string;
}