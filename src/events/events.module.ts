import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddressService } from 'src/addresses/address.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { MailerService } from 'src/mailer/mailer.service';


@Module({
  controllers: [EventsController],
  providers: [EventsService, AddressService, NotificationsService]
})
export class EventsModule { }
