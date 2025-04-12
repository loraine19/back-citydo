import { Module } from '@nestjs/common';
import { VotesService } from './votes.service';
import { VotesController } from './votes.controller';
import { NotificationsService } from 'src/notifications/notifications.service';
import { MailerService } from 'src/mailer/mailer.service';
import { NotifsGateway } from 'src/notifs/notifs.gateway';
import { UsersService } from 'src/users/users.service';

@Module({
  controllers: [VotesController],
  providers: [VotesService, NotificationsService, MailerService, NotifsGateway, UsersService],
})
export class VotesModule { }
