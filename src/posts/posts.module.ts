import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { ImageInterceptor } from 'middleware/ImageInterceptor';
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { MailerService } from 'src/mailer/mailer.service';

@Module({
  controllers: [PostsController],
  providers: [PostsService, ImageInterceptor, NotificationsService],
})
export class PostsModule { }
