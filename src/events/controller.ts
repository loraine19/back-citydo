import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, ValidationPipe } from '@nestjs/common';
import { EventService } from './service';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { GroupsService } from 'src/groups/groups.service';

  const route = 'event'  
  @Controller(route)
  export class EventController {
    constructor(private readonly service: EventService) {}
  
    @Post()
    create(@Body(new ValidationPipe()) data: CreateDto) {
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
    update(@Param('id') id: string, @Body() data: UpdateDto) {
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
  