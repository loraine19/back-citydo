import { Module } from '@nestjs/common';
import { ParticipantsService } from './participants.service';
import { ParticipantsController } from './participants.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersController } from 'src/users/users.controller';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [PrismaModule],
  controllers: [ParticipantsController, UsersController],
  providers: [ParticipantsService, UsersService],
})
export class ParticipantsModule { }
