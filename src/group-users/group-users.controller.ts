import { Controller, Body, Param, ParseIntPipe, UseGuards, Put, Post, Patch } from '@nestjs/common';
import { GroupUsersService } from './group-users.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GroupUserEntity } from './entities/group-user.entity';
import { AuthGuard } from '../auth/auth.guard';
import { $Enums, GroupUser } from '@prisma/client';
import { User } from 'middleware/decorators';
import { CreateGroupUserDto } from './dto/create-group-user.dto';

const route = "group-users";
@UseGuards(AuthGuard)
@Controller(route)
@ApiTags(route)

export class GroupUsersController {
  constructor(private readonly groupUsersService: GroupUsersService) { }

  @Post(':groupId')
  @ApiBearerAuth()
  @ApiResponse({ type: GroupUserEntity })
  async create(
    @User() userId: number,
    @Param('groupId', ParseIntPipe) groupId: number,
    @Body() data: { modo: boolean }

  ): Promise<GroupUser> {
    return this.groupUsersService.create(userId, groupId, data.modo);
  }


  @Put(':groupId')
  @ApiBearerAuth()
  @ApiResponse({ type: GroupUserEntity })
  async update(
    @User() userId: number,
    @Param('groupId', ParseIntPipe) groupId: number,
    @Body() data: { modo: boolean }): Promise<GroupUser> {
    return this.groupUsersService.update(userId, groupId, data.modo);
  }

  @Patch()
  @ApiBearerAuth()
  @ApiResponse({ type: GroupUserEntity, isArray: true })
  async updateAll(
    @User() userId: number,
    @Body() data: CreateGroupUserDto[]): Promise<GroupUser[]> {
    return this.groupUsersService.updateAll(userId, data);
  }

}
