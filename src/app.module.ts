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
import { ResetPasswordModule } from './reset-password/reset-password.module';
import { PoolsSurveysModule } from './pools-surveys/pools-surveys.module';
import { MailerModule } from './mailer/mailer.module';
import { LoggerModule } from './logger/logger.module';
import { NotificationsModule } from './notifications/notifications.module';
import { MessagesModule } from './messages/messages.module';
import { NotifsGateway } from './notifs/notifs.gateway';
import { CronTaskModule } from './cron-task/cron-task.module';
import { ScheduleModule } from '@nestjs/schedule';


@Module({
  imports: [
    MulterModule.register({
      dest: './public/',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    ScheduleModule.forRoot(),
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
    NotificationsModule,
    ResetPasswordModule,
    PoolsSurveysModule,
    MailerModule,
    LoggerModule,
    NotificationsModule,
    MessagesModule,
    CronTaskModule,
  ],
  // providers: [NotifsGateway],
})
export class AppModule { }
