import { Module } from '@nestjs/common';
import { SurveysService } from './surveys.service';
import { SurveysController } from './surveys.controller';
import { VotesService } from 'src/votes/votes.service';
import { ImageInterceptor } from 'middleware/ImageInterceptor';

@Module({
  controllers: [SurveysController],
  providers: [SurveysService, VotesService, ImageInterceptor],
})
export class SurveysModule { }
