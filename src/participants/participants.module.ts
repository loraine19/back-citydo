import { Module } from '@nestjs/common';
import { ParticipantsService } from './participants.service';
import { ParticipantsController } from './participants.controller';
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotifsGateway } from 'src/notifs/notifs.gateway';
import { UsersService } from 'src/users/users.service';

@Module({
  controllers: [ParticipantsController],
  providers: [ParticipantsService, NotificationsService, NotifsGateway, UsersService],
})
export class ParticipantsModule { }
