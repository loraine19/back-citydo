import { Module } from '@nestjs/common';
import { ParticipantsService } from './participants.service';
import { ParticipantsController } from './participants.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { EventsService } from '../events/events.service';
import { UsersService } from '../users/users.service';
import { ImageInterceptor } from 'middleware/ImageInterceptor';
@Module({
  imports: [PrismaModule],
  controllers: [ParticipantsController],
  providers: [ParticipantsService, EventsService, UsersService, ImageInterceptor],
})
export class ParticipantsModule { }
