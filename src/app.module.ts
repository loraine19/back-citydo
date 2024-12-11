import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { GroupsModule } from './groups/groups.module';
import { AddressModule } from './address/adress.module';
import { EventModule } from './events/events.module';
import { ParticipantsModule } from './participants/participants.module';

@Module({
  imports: [PrismaModule, UsersModule, GroupsModule, AddressModule, EventModule, ParticipantsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
