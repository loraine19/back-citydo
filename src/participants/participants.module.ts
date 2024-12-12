import { Module } from '@nestjs/common';
import { ParticipantsService } from './participants.service';
import { ParticipantsController } from './participants.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersController } from 'src/users/users.controller';
import { UsersService } from 'src/users/users.service';
import { GroupsController } from 'src/groups/groups.controller';
import { GroupsService } from 'src/groups/groups.service';

@Module({
  imports: [PrismaModule],
  controllers: [ParticipantsController, UsersController, GroupsController],
  providers: [ParticipantsService, UsersService, GroupsService],
})
export class ParticipantsModule { }
