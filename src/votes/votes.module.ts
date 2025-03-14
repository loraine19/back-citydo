import { Module } from '@nestjs/common';
import { VotesService } from './votes.service';
import { VotesController } from './votes.controller';
import { NotificationsService } from 'src/notifications/notifications.service';
import { MailerService } from 'src/mailer/mailer.service';

@Module({
  controllers: [VotesController],
  providers: [VotesService, NotificationsService, MailerService],
})
export class VotesModule { }
