import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersController } from 'src/routes/users/users.controller';
import { UsersService } from 'src/routes/users/users.service';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

@Module({
  imports: [PrismaModule,],
  controllers: [EventsController, UsersController],
  providers: [EventsService, UsersService],
})
export class EventsModule { }
