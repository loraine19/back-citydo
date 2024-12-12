import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, ValidationPipe, NotFoundException, BadRequestException, ParseIntPipe, ParseUUIDPipe } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from 'src/users/users.service';
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
    const user = await this.usersService.findOne(data.userId)
    if (!user) throw new BadRequestException(`no ${data.userId} find in users`)
    const event = await this.service.create(data)
    if (!event) throw new BadRequestException(`no ${route} created`)
    return { event }
  }

  @Get()
  @ApiOkResponse({ type: EventEntity, isArray: true })
  async findAll() {
    const events = await this.service.findAll()
    if (!events) throw new NotFoundException(`no one ${route} find`)
    return { events };
  }

  @Get(':id')
  @ApiOkResponse({ type: EventEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const event = await this.service.findOne(+id)
    if (!event) throw new NotFoundException(`no ${id} find in ${route}`)
    return { event }
  }

  @Get(':id&users')
  @ApiOkResponse({ type: EventEntity })
  async findOneUser(@Param('id', ParseIntPipe) id: number) {
    const event = await this.service.findOneUser(+id)
    if (!event) throw new NotFoundException(`no ${id} find in ${route}`)
    return { event };
  }

  @Patch(':id')
  @ApiOkResponse({ type: EventEntity })
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateEventDto): Promise<{ event: CreateEventDto }> {
    const user = await this.usersService.findOne(data.userId)
    if (!user) throw new BadRequestException(`no ${data.userId} find in users`)
    const find = await this.service.findOne(+id)
    if (!find) throw new NotFoundException(`no ${id} find in ${route}`)
    const event = await this.service.update(+id, data)
    if (!event) throw new BadRequestException(`${route} ${id} not updated`)
    return { event };
  }

  @Delete(':id')
  @ApiOkResponse({ type: EventEntity })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ event: CreateEventDto }> {
    const find = await this.service.findOne(+id)
    if (!find) throw new NotFoundException(`no ${id} find in ${route}`)
    const event = await this.service.remove(+id)
    if (!event) throw new BadRequestException(`${route} ${id} not deleted`)
    return { event }
  }
}
