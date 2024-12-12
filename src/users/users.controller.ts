import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, NotFoundException, BadRequestException, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

//// CONTROLLER DO ROUTE 
const route = 'users'

@Controller(route)
@ApiTags(route)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @ApiCreatedResponse({ type: UserEntity })
  async create(@Body() user: CreateUserDto) {
    try {
      return this.usersService.create(user);
    }
    catch (error: any) {
      console.log(error);
      return new BadRequestException("error");
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findAll() {
    const data = await this.usersService.findAll()
    if (!data) throw new NotFoundException(`no ${route} find`)
    return data;
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  async findOne(@Param('id') id: string) {
    const data = await this.usersService.findOne(+id)
    if (!data) throw new NotFoundException(`no ${id} find in ${route}`)
    return data;

  }
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() user: UpdateUserDto) {
    const find = this.usersService.findOne(+id)
    const update = this.usersService.update(+id, user)
    if (!find) throw new NotFoundException(`no ${id} find in ${route}`)
    if (!update) throw new NotFoundException(`${route} ${id} not updated`)
    return update;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    const find = this.usersService.findOne(+id)
    const remove = this.usersService.remove(+id)
    if (!find) throw new NotFoundException(`no ${id} find in ${route}`)
    if (!remove) throw new NotFoundException(`${route} ${id} not deleted`)
    return this.usersService.remove(+id);
  }
}
