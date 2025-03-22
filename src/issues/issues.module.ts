import { Module } from '@nestjs/common';
import { IssuesService } from './issues.service';
import { IssuesController } from './issues.controller';
import { ImageInterceptor } from 'middleware/ImageInterceptor';
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { NotifsGateway } from 'src/notifs/notifs.gateway';

@Module({
  imports: [NotificationsModule],
  controllers: [IssuesController],
  providers: [IssuesService, ImageInterceptor, NotificationsService, NotifsGateway],
})
export class IssuesModule { }
