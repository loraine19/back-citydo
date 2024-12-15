import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './routes/users/users.module';
import { GroupsModule } from './routes/groups/groups.module';
import { AddressModule } from './routes/address/adress.module';
import { EventsModule } from './routes/events/events.module';
import { ParticipantsModule } from './routes/participants/participants.module';
import { AuthModule } from './routes/auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PrismaFilter } from './prisma/prisma-client-exception.filter';
import { ServiceModule } from './routes/service/service.module';
import { ProfilesModule } from './routes/profiles/profiles.module';
import { GroupUsersModule } from './routes/group-users/group-users.module';


@Module({
  imports: [UsersModule, GroupsModule, AddressModule, EventsModule, ParticipantsModule, AuthModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../home', 'client'),
    }),
    ServiceModule,
    ProfilesModule,
    GroupUsersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
