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
import { PrismaFilter } from '../utils/filter/prisma.filter';
import { ServiceModule } from './service/service.module';
import { ProfilesModule } from './profiles/profiles.module';
import { GroupUsersModule } from './group-users/group-users.module';
import { PostsModule } from './posts/posts.module';
import { LikesModule } from './likes/likes.module';




@Module({
  imports: [
    AuthModule,
    AddressModule,
    GroupsModule,
    UsersModule,
    GroupUsersModule,
    ProfilesModule,
    EventsModule,
    ParticipantsModule,
    ServiceModule,
    PostsModule,
    LikesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
