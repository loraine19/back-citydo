import { Module } from '@nestjs/common';
import { ResetPasswordController } from './reset-password.controller';
import { ResetPasswordService } from './reset-password.service';
import { MailerService } from 'src/mailer/mailer.service';

@Module({
  controllers: [ResetPasswordController],
  providers: [ResetPasswordService, MailerService]
})
export class ResetPasswordModule { }
