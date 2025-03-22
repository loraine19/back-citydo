import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { ChatGateway } from 'src/chat/chat.gateway';
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotifsGateway } from 'src/notifs/notifs.gateway';

@Module({
  controllers: [MessagesController],
  providers: [MessagesService, ChatGateway, NotificationsService, NotifsGateway],
})
export class MessagesModule { }
