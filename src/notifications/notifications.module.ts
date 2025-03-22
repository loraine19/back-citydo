import { Global, Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { MailerService } from 'src/mailer/mailer.service';
import { NotifsGateway } from 'src/notifs/notifs.gateway';

@Global()
@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, MailerService, NotifsGateway],
  exports: [NotificationsService]
})
export class NotificationsModule { }
