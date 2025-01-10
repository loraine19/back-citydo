import { Module } from '@nestjs/common';
import { ServicesService } from './service.service';
import { ServicesController } from './service.controller';
import { ImageInterceptor } from 'middleware/ImageInterceptor';

@Module({
  controllers: [ServicesController],
  providers: [ServicesService, ImageInterceptor],
})
export class ServiceModule { }
