import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { ImageInterceptor } from 'middleware/ImageInterceptor';
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotifsGateway } from 'src/notifs/notifs.gateway';

@Module({
  controllers: [LikesController],
  providers: [LikesService, ImageInterceptor, NotificationsService, NotifsGateway],
})
export class LikesModule { }
