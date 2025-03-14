import { Module } from '@nestjs/common';
import { PoolsSurveysService } from './pools-surveys.service';
import { PoolsSurveysController } from './pools-surveys.controller';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { NotificationsService } from 'src/notifications/notifications.service';
import { MailerService } from 'src/mailer/mailer.service';

@Module({
  controllers: [PoolsSurveysController],
  providers: [PoolsSurveysService, NotificationsService],
})
export class PoolsSurveysModule { }
