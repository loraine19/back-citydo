import { Transform } from 'class-transformer';
import { ResetPasswordEnity } from '../entities/reset-password.entity';
import { IsEmail, IsString, Length } from 'class-validator';
export class CreateResetPasswordDto implements ResetPasswordEnity {

    @IsEmail()
    @Transform(({ value }) => value.trim())
    email: string;

    @IsString()
    @Transform(({ value }) => value.trim())
    resetToken: string;

    @IsString()
    @Transform(({ value }) => value.trim())
    @Length(8, 20)
    password: string;
}
