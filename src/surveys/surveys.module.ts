import { Module } from '@nestjs/common';
import { SurveysService } from './surveys.service';
import { SurveysController } from './surveys.controller';
import { VotesService } from 'src/votes/votes.service';

@Module({
  controllers: [SurveysController],
  providers: [SurveysService, VotesService],
})
export class SurveysModule { }
