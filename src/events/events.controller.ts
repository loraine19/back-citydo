import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, ValidationPipe, NotFoundException, BadRequestException } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from 'src/users/users.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventEntity } from './entities/event.entity';
import { EventsService } from './events.service';

const route = 'event'
@Controller(route)
@ApiTags(route)
export class EventsController {
  constructor(private readonly service: EventsService, private usersService: UsersService) { }


  /// CHECK FK
  @Post()
  async create(@Body() data: CreateEventDto) {
    try {
      const find = await this.usersService.findOne(data.userId)
      if (!find) throw new NotFoundException(`no ${route} find`)
      return await this.service.create(data);
    }
    catch (error: any) {
      console.log(error);
      return new BadRequestException("error");
    }
  }

  @Get()
  async findAll() {
    const data = await this.service.findAll()
    if (!data) throw new NotFoundException(`no ${route} find`)
    return data;
  }

  @Get(':id')
  @ApiOkResponse({ type: EventEntity })
  async findOne(@Param('id') id: string) {
    const data = await this.service.findOne(+id)
    if (!data) throw new NotFoundException(`no ${id} find in ${route}`)
    return data;

  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateEventDto) {
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
