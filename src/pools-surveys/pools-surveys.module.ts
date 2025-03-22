import { Module } from '@nestjs/common';
import { PoolsSurveysService } from './pools-surveys.service';
import { PoolsSurveysController } from './pools-surveys.controller';
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotifsGateway } from 'src/notifs/notifs.gateway';

@Module({
  controllers: [PoolsSurveysController],
  providers: [PoolsSurveysService, NotificationsService, NotifsGateway],
})
export class PoolsSurveysModule { }
