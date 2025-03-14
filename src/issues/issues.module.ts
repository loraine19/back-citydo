import { Module } from '@nestjs/common';
import { IssuesService } from './issues.service';
import { IssuesController } from './issues.controller';
import { ImageInterceptor } from 'middleware/ImageInterceptor';
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { MailerService } from 'src/mailer/mailer.service';

@Module({
  imports: [NotificationsModule],
  controllers: [IssuesController],
  providers: [IssuesService, ImageInterceptor, NotificationsService],
})
export class IssuesModule { }
