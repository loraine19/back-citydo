import { Module } from '@nestjs/common';
import { ServicesService } from './service.service';
import { ServicesController } from './service.controller';

@Module({
  controllers: [ServicesController],
  providers: [ServicesService],
})
export class ServiceModule { }
