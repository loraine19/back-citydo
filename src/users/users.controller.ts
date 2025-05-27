import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, HttpException, HttpStatus, Req } from '@nestjs/common';
import { ApiCreatedResponse, ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { AuthGuard } from '../../src/auth/auth.guard';
import { User } from '@prisma/client';
import { User as UserDec } from 'middleware/decorators';


//// CONTROLLER DO ROUTE 
const route = 'users'
@Controller(route)
@ApiTags(route)
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @ApiCreatedResponse({ type: UserEntity })
  async create(@Body() data: CreateUserDto): Promise<User> {
    const user = await this.usersService.findUnique(data.email)
    return await this.usersService.create(data);
  }

  @Get('inGroup/:groupId')
  @ApiBearerAuth()
  async findAll(
    @Param('groupId', ParseIntPipe) groupId: number,
    @UserDec() userId: number): Promise<Partial<User>[]> {
    return await this.usersService.usersInGroup(userId, [groupId]) || []
  }


  @Get('modos/:groupId')
  @ApiBearerAuth()
  async findAllModo(
    @Param('groupId', ParseIntPipe) groupId: number,
    @UserDec() userId: number): Promise<Partial<User>[]> {
    console.log('userId', userId, 'groupId', groupId)
    return await this.usersService.findAllModo(userId, groupId) || []
  }

  @Get('count/:groupId')
  @ApiBearerAuth()
  async count(
    @Param('groupId', ParseIntPipe) groupId: number,
    @UserDec() userId: number): Promise<number> {
    return await this.usersService.count(groupId, userId)
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  async FindMe(@UserDec() userId: number): Promise<Partial<User>> {
    return this.usersService.findOne(userId)
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  async FindOne(
    @Param('id', ParseIntPipe) id: number,
    @UserDec() userId: number): Promise<Partial<User>> {
    return this.usersService.findOne(id)
  }

  @Patch(':id')
  @ApiBearerAuth()
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateUserDto): Promise<User> {
    return this.usersService.update(id, data)
  }

  @Delete(':id')
  @ApiBearerAuth()
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @UserDec() userId: number): Promise<{ message: string }> {
    return await this.usersService.remove(id, userId)
  }
}
