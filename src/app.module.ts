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
import { ServiceModule } from './service/service.module';
import { ProfilesModule } from './profiles/profiles.module';
import { GroupUsersModule } from './group-users/group-users.module';
import { PostsModule } from './posts/posts.module';
import { LikesModule } from './likes/likes.module';
import { PoolsModule } from './pools/pools.module';
import { SurveysModule } from './surveys/surveys.module';
import { VotesModule } from './votes/votes.module';
import { MulterModule } from '@nestjs/platform-express';
import { UploadsModule } from './uploads/uploads.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { RefreshModule } from './refresh/refresh.module';


@Module({
  imports: [
    MulterModule.register({
      dest: './dist/public/uploads',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    UploadsModule,
    AuthModule,
    AddressModule,
    GroupsModule,
    GroupUsersModule,
    UsersModule,
    ProfilesModule,
    EventsModule,
    ParticipantsModule,
    ServiceModule,
    PostsModule,
    LikesModule,
    PoolsModule,
    SurveysModule,
    VotesModule,
    RefreshModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
