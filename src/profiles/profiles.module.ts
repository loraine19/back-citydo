import { Module } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ImageInterceptor } from 'middleware/ImageInterceptor';
import { AddressService } from 'src/addresses/address.service';

@Module({
  controllers: [ProfilesController],
  providers: [ProfilesService, AddressService, ImageInterceptor],
})
export class ProfilesModule { }
