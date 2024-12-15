import { Module } from '@nestjs/common';
import { ParticipantsService } from './participants.service';
import { ParticipantsController } from './participants.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersController } from 'src/routes/users/users.controller';
import { UsersService } from 'src/routes/users/users.service';
import { GroupsController } from 'src/routes/groups/groups.controller';
import { GroupsService } from 'src/routes/groups/groups.service';
import { EventsController } from 'src/routes/events/events.controller';
import { EventsService } from 'src/routes/events/events.service';

@Module({
  imports: [PrismaModule],
  controllers: [ParticipantsController, UsersController, EventsController],
  providers: [ParticipantsService, UsersService, EventsService],
})
export class ParticipantsModule { }
