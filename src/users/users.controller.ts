import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBody, ApiCreatedResponse, ApiResponse } from '@nestjs/swagger';

//// CONTROLLER DO ROUTE 
const route = 'users'
class classCreate extends CreateUserDto{};
class classUpdate extends UpdateUserDto{ }

@Controller(route)
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Post()
  create(@Body(new ValidationPipe()) data: classCreate) {
    const creat = this.service.create(data);
    if (!creat) throw new HttpException(`no ${route} created`, HttpStatus.NOT_IMPLEMENTED)
    return this.service.create(data);
  }

  @Get()
  async findAll() {
    const data = await this.service.findAll()
    if (!data) throw new HttpException(`no ${route} find`, HttpStatus.NO_CONTENT)
    return data;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
   const data = await this.service.findOne(+id)
    if (!data) throw new HttpException(`no ${id} find in ${route}`, HttpStatus.NOT_FOUND)
    return data;
    
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: classUpdate) {
    const find = this.service.findOne(+id)
    const update = this.service.update(+id, data)
    if (!find) throw new HttpException(`no ${id} find in ${route}`, HttpStatus.NOT_FOUND)
    if (!update) throw new HttpException(`${route} ${id} not updated`, HttpStatus.NOT_IMPLEMENTED)
    return update;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const find = this.service.findOne(+id)
    const remove = this.service.remove(+id)
    if (!find) throw new HttpException(`no ${id} find in ${route}`, HttpStatus.NOT_FOUND)
    if (!remove) throw new HttpException(`${route} ${id} not deleted`, HttpStatus.NOT_IMPLEMENTED)
    return this.service.remove(+id);
  }
}
