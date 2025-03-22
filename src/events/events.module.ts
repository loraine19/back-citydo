import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { AddressService } from 'src/addresses/address.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotifsGateway } from 'src/notifs/notifs.gateway';


@Module({
  controllers: [EventsController],
  providers: [EventsService, AddressService, NotificationsService, NotifsGateway]
})
export class EventsModule { }
