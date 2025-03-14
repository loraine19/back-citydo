import { Module } from '@nestjs/common';
import { FlagsService } from './flags.service';
import { FlagsController } from './flags.controller';
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { MailerService } from 'src/mailer/mailer.service';

@Module({
  controllers: [FlagsController],
  providers: [FlagsService, NotificationsService, MailerService],
})
export class FlagsModule { }
