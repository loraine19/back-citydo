import { Module } from '@nestjs/common';
import { IssuesService } from './issues.service';
import { IssuesController } from './issues.controller';
import { ImageInterceptor } from 'middleware/ImageInterceptor';

@Module({
  controllers: [IssuesController],
  providers: [IssuesService, ImageInterceptor],
})
export class IssuesModule { }
