import { Module } from '@nestjs/common';
import { ServicesService } from './service.service';
import { ServicesController } from './service.controller';
import { ImageInterceptor } from 'middleware/ImageInterceptor';
import { MailerService } from 'src/mailer/mailer.service';

@Module({
  controllers: [ServicesController],
  providers: [ServicesService, ImageInterceptor, MailerService],
})
export class ServiceModule { }
