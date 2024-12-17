import { Module } from '@nestjs/common';
import { ParticipantsService } from './participants.service';
import { ParticipantsController } from './participants.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersController } from 'src/users/users.controller';
import { UsersService } from 'src/users/users.service';
import { EventsController } from 'src/events/events.controller';
import { EventsService } from 'src/events/events.service';

@Module({
  imports: [PrismaModule],
  controllers: [ParticipantsController, UsersController, EventsController],
  providers: [ParticipantsService, UsersService, EventsService],
})
export class ParticipantsModule { }
