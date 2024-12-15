import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';
import { AddressService } from 'src/routes/address/address.service';
import { AddressController } from 'src/routes/address/address.controller';

@Module({
  imports: [PrismaModule],
  controllers: [GroupsController, AddressController],
  providers: [GroupsService, AddressService],
})
export class GroupsModule { }
