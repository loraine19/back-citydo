import { Controller, Body, Param, ParseIntPipe, UseGuards, Put, Post, Patch, Delete } from '@nestjs/common';
import { GroupUsersService } from './group-users.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GroupUserEntity } from './entities/group-user.entity';
import { AuthGuard } from '../auth/auth.guard';
import { $Enums, GroupUser } from '@prisma/client';
import { User } from 'middleware/decorators';
import { CreateGroupUserDto } from './dto/create-group-user.dto';
import { UpdateGroupUserDto } from './dto/update-group-user.dto';

const route = "groups-users";
@UseGuards(AuthGuard)
@Controller(route)
@ApiTags(route)

export class GroupUsersController {
  constructor(private readonly groupUsersService: GroupUsersService) { }
  @Post()
  @ApiBearerAuth()
  @ApiResponse({ type: GroupUserEntity })
  async create(
    @User() userId: number,
    @Body() data: CreateGroupUserDto): Promise<GroupUser> {
    return this.groupUsersService.create(userId, data);
  }

  @Put()
  @ApiBearerAuth()
  @ApiResponse({ type: GroupUserEntity })
  async update(
    @User() userId: number,
    @Body() data: UpdateGroupUserDto): Promise<GroupUser> {
    return this.groupUsersService.update(userId, data);
  }

  @Patch()
  @ApiBearerAuth()
  @ApiResponse({ type: GroupUserEntity, isArray: true })
  async updateAll(
    @User() userId: number,
    @Body() data: CreateGroupUserDto[]): Promise<GroupUser[]> {
    return this.groupUsersService.updateAll(userId, data);
  }

  @Delete(':groupId')
  @ApiBearerAuth()
  @ApiResponse({ type: GroupUserEntity })
  async delete(
    @User() userId: number,
    @Param('groupId', ParseIntPipe) groupId: number): Promise<GroupUser> {
    return this.groupUsersService.delete(userId, groupId);
  }

}
