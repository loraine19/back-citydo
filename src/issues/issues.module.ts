import { Module } from '@nestjs/common';
import { IssuesService } from './issues.service';
import { IssuesController } from './issues.controller';
import { ImageInterceptor } from 'middleware/ImageInterceptor';
import { MailerService } from 'src/mailer/mailer.service';

@Module({
  controllers: [IssuesController],
  providers: [IssuesService, ImageInterceptor, MailerService],
})
export class IssuesModule { }
