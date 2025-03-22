import { Module } from '@nestjs/common';
import { FlagsService } from './flags.service';
import { FlagsController } from './flags.controller';
import { NotificationsService } from 'src/notifications/notifications.service';
import { MailerService } from 'src/mailer/mailer.service';
import { NotifsGateway } from 'src/notifs/notifs.gateway';

@Module({
  controllers: [FlagsController],
  providers: [FlagsService, NotificationsService, MailerService, NotifsGateway],
})
export class FlagsModule { }
