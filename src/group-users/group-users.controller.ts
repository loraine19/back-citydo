import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, NotFoundException, HttpException } from '@nestjs/common';
import { CreateGroupUserDto } from './dto/create-group-user.dto';
import { UpdateGroupUserDto } from './dto/update-group-user.dto';
import { GroupUsersService } from './group-users.service';
import { ApiResponse } from '@nestjs/swagger';
import { GroupUserEntity } from './entities/group-user.entity';

const route = "group-users"
@Controller(route)
export class GroupUsersController {
  constructor(private readonly groupUsersService: GroupUsersService) { }

  @Post()
  create(@Body() createGroupUserDto: CreateGroupUserDto) {
    return this.groupUsersService.create(createGroupUserDto);
  }

  @Get()
  @ApiResponse({ type: GroupUserEntity, isArray: true })
  async findAll() {
    const groupUsers = await this.groupUsersService.findAll()
    if (!groupUsers.length) throw new HttpException(`no ${route} found`, 204);
    return this.groupUsersService.findAll();
  }

  @Get('user:userId&group:groupId')
  async findOne(@Param('userId', ParseIntPipe) userId: number, @Param('groupId', ParseIntPipe) groupId: number) {
    return this.groupUsersService.findOne(userId, groupId)
  }


  @Patch('user:userId&event:groupId')
  @ApiResponse({ type: GroupUserEntity })
  async update(@Param('userId', ParseIntPipe) userId: number, @Param('groupId', ParseIntPipe) groupId: number, @Body() data: UpdateGroupUserDto) {
    const participant = this.groupUsersService.update({ ...data, userId, groupId });
    return participant
  }

  @Delete('user:userId&event:groupId')
  @ApiResponse({ type: GroupUserEntity })
  remove(@Param('userId', ParseIntPipe) userId: number, @Param('groupId', ParseIntPipe) groupId: number) {
    const participant = this.groupUsersService.remove(userId, groupId);
    return participant
  }
}
