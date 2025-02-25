import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { GroupsModule } from './groups/groups.module';
import { AddressModule } from './addresses/address.module';
import { EventsModule } from './events/events.module';
import { ParticipantsModule } from './participants/participants.module';
import { AuthModule } from './auth/auth.module';
import { ServiceModule } from './service/service.module';
import { ProfilesModule } from './profiles/profiles.module';
import { GroupUsersModule } from './group-users/group-users.module';
import { PostsModule } from './posts/posts.module';
import { LikesModule } from './likes/likes.module';
import { VotesModule } from './votes/votes.module';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { FlagsModule } from './flags/flags.module';
import { IssuesModule } from './issues/issues.module';
import { NotifsModule } from './notifs/notifs.module';
import { ResetPasswordModule } from './reset-password/reset-password.module';
import { PoolsSurveysModule } from './pools-surveys/pools-surveys.module';
import { MailerModule } from './mailer/mailer.module';
import { LoggerModule } from './logger/logger.module';


@Module({
  imports: [
    MulterModule.register({
      dest: './public/',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
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
    VotesModule,
    FlagsModule,
    IssuesModule,
    NotifsModule,
    ResetPasswordModule,
    PoolsSurveysModule,
    MailerModule,
    LoggerModule,
  ],
})
export class AppModule { }
