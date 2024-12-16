import { Module } from '@nestjs/common';
import { GroupUsersService } from './group-users.service';
import { GroupUsersController } from './group-users.controller';

@Module({
  controllers: [GroupUsersController],
  providers: [GroupUsersService],
})
export class GroupUsersModule {}
