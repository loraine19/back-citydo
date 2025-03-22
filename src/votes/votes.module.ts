import { Module } from '@nestjs/common';
import { VotesService } from './votes.service';
import { VotesController } from './votes.controller';
import { NotificationsService } from 'src/notifications/notifications.service';
import { MailerService } from 'src/mailer/mailer.service';
import { NotifsGateway } from 'src/notifs/notifs.gateway';

@Module({
  controllers: [VotesController],
  providers: [VotesService, NotificationsService, MailerService, NotifsGateway],
})
export class VotesModule { }
