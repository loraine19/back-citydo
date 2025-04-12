import { Module } from '@nestjs/common';
import { CronTaskService } from './cron-task.service';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotifsGateway } from 'src/notifs/notifs.gateway';

@Module({
  imports: [ScheduleModule],
  providers: [CronTaskService, NotificationsService, NotifsGateway]
})
export class CronTaskModule { }
