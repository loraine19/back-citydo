import { Module } from '@nestjs/common';
import { PrismaModule } from '../../src/prisma/prisma.module';
import { UsersService } from '../../src/users/users.service';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

@Module({
  imports: [PrismaModule,],
  controllers: [EventsController],
  providers: [EventsService, UsersService]
})
export class EventsModule { }
