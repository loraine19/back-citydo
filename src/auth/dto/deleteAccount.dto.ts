import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteAccountDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  deleteToken: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  email: string;
}
