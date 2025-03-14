import { Module } from '@nestjs/common';
import { ParticipantsService } from './participants.service';
import { ParticipantsController } from './participants.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { MailerService } from 'src/mailer/mailer.service';

@Module({
  controllers: [ParticipantsController],
  providers: [ParticipantsService, NotificationsService],
})
export class ParticipantsModule { }
