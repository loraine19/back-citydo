import { Module } from '@nestjs/common';
import { CronTaskService } from './cron-task.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule],
  providers: [CronTaskService]
})
export class CronTaskModule { }
