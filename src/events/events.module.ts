import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersService } from '../users/users.service';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { ImageInterceptor } from 'middleware/ImageInterceptor';


@Module({
  imports: [PrismaModule],
  controllers: [EventsController],
  providers: [EventsService, UsersService, ImageInterceptor]
})
export class EventsModule { }
