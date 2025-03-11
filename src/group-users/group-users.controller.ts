import { Controller, Body, Param, ParseIntPipe, UseGuards, Put } from '@nestjs/common';
import { GroupUsersService } from './group-users.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GroupUserEntity } from './entities/group-user.entity';
import { AuthGuard } from '../auth/auth.guard';
import { GroupUser } from '@prisma/client';
import { User } from 'middleware/decorators';

const route = "group-users";
@UseGuards(AuthGuard)
@Controller(route)
@ApiTags(route)

export class GroupUsersController {
  constructor(private readonly groupUsersService: GroupUsersService) { }


  @Put(':groupId')
  @ApiBearerAuth()
  @ApiResponse({ type: GroupUserEntity })
  async update(
    @User() userId: number,
    @Param('groupId', ParseIntPipe) groupId: number,
    @Body() data: { modo: boolean }): Promise<GroupUser> {
    return this.groupUsersService.update(userId, groupId, data.modo);
  }

}
