import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { ImageInterceptor } from 'middleware/ImageInterceptor';
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotifsGateway } from 'src/notifs/notifs.gateway';

@Module({
  controllers: [PostsController],
  providers: [PostsService, ImageInterceptor, NotificationsService, NotifsGateway],
})
export class PostsModule { }
