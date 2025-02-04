import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, HttpException, HttpStatus, Req } from '@nestjs/common';
import { ApiCreatedResponse, ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { AuthGuard } from '../../src/auth/auth.guard';
import { RequestWithUser } from 'src/auth/auth.entities/auth.entity';
import { User } from '@prisma/client';
import { EventsService } from '../events/events.service';
import { ServicesService } from '../service/service.service';
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

  @Get('modos')
  @ApiBearerAuth()
  async findAllModo(@UserDec() userId: number): Promise<Partial<User>[]> {
    return await this.usersService.findAllModo(userId) || []
  }

  @Get('count')
  @ApiBearerAuth()
  async count(@UserDec() userId: number): Promise<number> {
    return await this.usersService.count(userId)
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  async FindMe(@UserDec() userId: number): Promise<Partial<User>> {
    return this.usersService.findOne(userId)
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
