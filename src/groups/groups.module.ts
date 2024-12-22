import { Module } from '@nestjs/common';
import { PrismaModule } from '../../src/prisma/prisma.module';
import { GroupsController } from '../groups/groups.controller';
import { GroupsService } from '../groups/groups.service';
import { AddressService } from '../address/address.service';
import { AddressController } from '../address/address.controller';
import { AddressModule } from '../address/address.module';
import { AuthGuard } from '@nestjs/passport';
import { AuthModule } from '../../src/auth/auth.module';

@Module({
  imports: [PrismaModule, AddressModule],
  controllers: [GroupsController, AddressController],
  providers: [GroupsService, AddressService],
})
export class GroupsModule { }
