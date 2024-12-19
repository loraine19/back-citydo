
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RefreshDto {


  @ApiProperty()
  @IsNotEmpty()
  refreshToken: string;

}