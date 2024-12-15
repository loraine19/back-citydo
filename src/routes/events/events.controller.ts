import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, ValidationPipe, NotFoundException, BadRequestException, ParseIntPipe, ParseUUIDPipe, PipeTransform } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from 'src/routes/users/users.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventEntity } from './entities/event.entity';
import { EventsService } from './events.service';

const route = 'events'
@Controller(route)
@ApiTags(route)
export class EventsController {
  constructor(private readonly service: EventsService, private usersService: UsersService) { }

  @Post()
  @ApiOkResponse({ type: EventEntity })
  async create(@Body() data: CreateEventDto) {
    return this.service.create(data)
  }

  @Get()
  @ApiOkResponse({ type: EventEntity, isArray: true })
  async findAll() {
    const events = await this.service.findAll()
    if (!events) throw new NotFoundException(`no one ${route} find`)
    return events;
  }

  @Get(':id')
  @ApiOkResponse({ type: EventEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id)
  }

  @Get(':id/withUsers')
  @ApiOkResponse({ type: EventEntity })
  findOneUser(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOneUser(id)

  }

  @Patch(':id')
  @ApiOkResponse({ type: EventEntity })
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateEventDto): Promise<UpdateEventDto> {
    return this.service.update(id, data)

  }

  @Delete(':id')
  @ApiOkResponse({ type: EventEntity })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<CreateEventDto> {
    return this.service.remove(+id)
  }
}
