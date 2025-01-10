import { Module } from '@nestjs/common';
import { PoolsSurveysService } from './pools-surveys.service';
import { PoolsSurveysController } from './pools-surveys.controller';

@Module({
  controllers: [PoolsSurveysController],
  providers: [PoolsSurveysService],
})
export class PoolsSurveysModule {}
