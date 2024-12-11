import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, ValidationPipe, NotFoundException } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GroupEntity } from './entities/group.entity';
import { GroupsService } from './groups.service';

//// CONTROLLER DO ROUTE 
const route = 'groups'
@Controller(route)
@ApiTags(route)
export class GroupsController {
  constructor(private readonly service: GroupsService) { }

  @Post()
  create(@Body(new ValidationPipe()) data: CreateGroupDto) {
    const creat = this.service.create(data);
    if (!creat) throw new NotFoundException(`no ${route} created`)
    return this.service.create(data);
  }

  @Get()
  async findAll() {
    const data = await this.service.findAll()
    if (!data) throw new NotFoundException(`no ${route} find`)
    return data;
  }

  @Get(':id')
  @ApiOkResponse({ type: GroupEntity })
  async findOne(@Param('id') id: string) {
    const data = await this.service.findOne(+id)
    if (!data) throw new NotFoundException(`no ${id} find in ${route}`)
    return data;

  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateGroupDto) {
    const find = this.service.findOne(+id)
    const update = this.service.update(+id, data)
    if (!find) throw new NotFoundException(`no ${id} find in ${route}`)
    if (!update) throw new NotFoundException(`${route} ${id} not updated`)
    return update;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const find = this.service.findOne(+id)
    const remove = this.service.remove(+id)
    if (!find) throw new NotFoundException(`no ${id} find in ${route}`)
    if (!remove) throw new NotFoundException(`${route} ${id} not deleted`)
    return this.service.remove(+id);
  }
}
