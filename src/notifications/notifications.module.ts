import { Global, Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { MailerService } from 'src/mailer/mailer.service';

@Global()
@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, MailerService],
})
export class NotificationsModule { }
