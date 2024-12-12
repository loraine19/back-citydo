import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { GroupsModule } from './groups/groups.module';
import { AddressModule } from './address/adress.module';
import { EventsModule } from './events/events.module';
import { ParticipantsModule } from './participants/participants.module';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';


@Module({
  imports: [PrismaModule, UsersModule, GroupsModule, AddressModule, EventsModule, ParticipantsModule, AuthModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../home', 'client'),
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
