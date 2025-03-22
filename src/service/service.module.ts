import { Module } from '@nestjs/common';
import { ServicesService } from './service.service';
import { ServicesController } from './service.controller';
import { ImageInterceptor } from 'middleware/ImageInterceptor';
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotifsGateway } from 'src/notifs/notifs.gateway';

@Module({
  controllers: [ServicesController,],
  providers: [ServicesService, ImageInterceptor, NotificationsService, NotifsGateway],
})
export class ServiceModule { }
