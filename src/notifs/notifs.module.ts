import { Module } from '@nestjs/common';
import { NotifsService } from './notifs.service';
import { NotifsController } from './notifs.controller';

@Module({
  controllers: [NotifsController],
  providers: [NotifsService],
})
export class NotifsModule {}
