import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersService } from '../users/users.service';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { ImageInterceptor } from 'middleware/ImageInterceptor';
import { MailerService } from 'src/mailer/mailer.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddressService } from 'src/addresses/address.service';


@Module({
  imports: [PrismaModule],
  controllers: [EventsController],
  providers: [EventsService, UsersService, AddressService, ImageInterceptor, MailerService, PrismaService]
})
export class EventsModule { }
