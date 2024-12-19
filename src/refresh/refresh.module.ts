import { Module } from '@nestjs/common';
import { RefreshService } from './refresh.service';
import { RefreshController } from './refresh.controller';

@Module({
  controllers: [RefreshController],
  providers: [RefreshService],
})
export class RefreshModule {}
