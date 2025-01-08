import { Module } from '@nestjs/common';
import { ResetPasswordController } from './reset-password.controller';

@Module({
  controllers: [ResetPasswordController],
})
export class ResetPasswordModule { }
