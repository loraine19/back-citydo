import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UploadedFile, UseInterceptors, UseGuards, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags, ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventEntity } from './entities/event.entity';
import { EventsService } from './events.service';
import { ImageInterceptor } from '../../middleware/ImageInterceptor';
import { parseData } from '../../middleware/BodyParser';
import { AuthGuard } from '../auth/auth.guard';
import { Event } from '@prisma/client';
import { User } from '../../middleware/decorators';

const route = 'events'
@Controller(route)
@ApiTags(route)
@UseGuards(AuthGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) { }
  @Post()
  @ApiBearerAuth()
  @ApiOkResponse({ type: EventEntity })
  @ApiBody({ type: CreateEventDto })
  @UseInterceptors(ImageInterceptor.create('events'))
  @ApiConsumes('multipart/form-data')
  async create(
    @Body() data: CreateEventDto,
    @UploadedFile() image: Express.Multer.File,
    @User() userId: number):
    Promise<Event> {
    data.userId = userId
    data = await parseData(data, image)
    return this.eventsService.create(data)
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: EventEntity })
  @ApiBody({ type: UpdateEventDto })
  @UseInterceptors(ImageInterceptor.create('events'))
  @ApiConsumes('multipart/form-data')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateEventDto,
    @UploadedFile() image: Express.Multer.File,
    @User() userId: number,): Promise<Event> {
    const event = await this.eventsService.findOne(id, userId)
    event.image && image && ImageInterceptor.deleteImage(event.image)
    data = await parseData(data, image)
    return this.eventsService.update(id, data, userId)
  }

  @Get()
  @ApiBearerAuth()
  @ApiOkResponse({ type: EventEntity, isArray: true })
  async findAll(
    @User() userId: number,
    @Query('page', ParseIntPipe) page?: number,
    @Query('filter') filter?: string,
    @Query('category') category?: string,
    @Query('sort') sort?: string,
    @Query('reverse') reverse?: boolean
  ): Promise<{ events: Event[], count: number }> {
    return this.eventsService.findAll(userId, page, category, filter, sort, reverse);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: EventEntity })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @User() userId: number,):
    Promise<Event> {
    return this.eventsService.findOne(id, userId)
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: EventEntity })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @User() userId: number): Promise<Event> {
    return this.eventsService.remove(id, userId)
  }

}



