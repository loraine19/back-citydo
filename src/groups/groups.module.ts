import { Module } from '@nestjs/common';
import { GroupsController } from '../groups/groups.controller';
import { GroupsService } from '../groups/groups.service';
import { AddressService } from '../addresses/address.service';

@Module({
  controllers: [GroupsController],
  providers: [GroupsService, AddressService],
})
export class GroupsModule { }
