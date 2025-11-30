
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RefreshDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'to short token' })
  refreshToken: string;
}