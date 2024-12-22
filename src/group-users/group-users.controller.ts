import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, NotFoundException, HttpException, UseGuards } from '@nestjs/common';
import { CreateGroupUserDto } from './dto/create-group-user.dto';
import { UpdateGroupUserDto } from './dto/update-group-user.dto';
import { GroupUsersService } from './group-users.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GroupUserEntity } from './entities/group-user.entity';
import { AuthGuard } from '../auth/auth.guard';
import { GroupUser } from '@prisma/client';

const route = "group-users"
@UseGuards(AuthGuard)
@Controller(route)
@ApiTags(route)

export class GroupUsersController {
  constructor(private readonly groupUsersService: GroupUsersService) { }

  @Post()
  @ApiBearerAuth()
  create(@Body() createGroupUserDto: CreateGroupUserDto): Promise<GroupUser> {
    return this.groupUsersService.create(createGroupUserDto);
  }

  @Get()
  @ApiBearerAuth()
  @ApiResponse({ type: GroupUserEntity, isArray: true })
  async findAll(): Promise<GroupUser[]> {
    const groupUsers = await this.groupUsersService.findAll()
    if (!groupUsers.length) throw new HttpException(`no ${route} found`, 204);
    return this.groupUsersService.findAll();
  }

  @Get('user:userId&group:groupId')
  @ApiBearerAuth()
  @ApiBearerAuth()
  async findOne(@Param('userId', ParseIntPipe) userId: number, @Param('groupId', ParseIntPipe) groupId: number): Promise<GroupUser> {
    return this.groupUsersService.findOne(userId, groupId)
  }


  @Patch('user:userId&event:groupId')
  @ApiBearerAuth()
  @ApiResponse({ type: GroupUserEntity })
  async update(@Param('userId', ParseIntPipe) userId: number, @Param('groupId', ParseIntPipe) groupId: number, @Body() data: UpdateGroupUserDto): Promise<GroupUser> {
    const participant = this.groupUsersService.update({ ...data, userId, groupId });
    return participant
  }

  @Delete('user:userId&event:groupId')
  @ApiBearerAuth()
  @ApiResponse({ type: GroupUserEntity })
  remove(@Param('userId', ParseIntPipe) userId: number, @Param('groupId', ParseIntPipe) groupId: number): Promise<GroupUser> {
    const participant = this.groupUsersService.remove(userId, groupId);
    return participant
  }
}
