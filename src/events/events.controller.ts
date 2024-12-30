import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, ParseIntPipe, Req, UploadedFile, UseInterceptors, UseGuards, } from '@nestjs/common';
import { ApiOkResponse, ApiTags, ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventEntity } from './entities/event.entity';
import { EventsService } from './events.service';
import { ImageInterceptor } from '../../middleware/ImageInterceptor';
import { parseData } from '../../middleware/BodyParser';
import { RequestWithUser } from '../auth/auth.entities/auth.entity';
import { AuthGuard } from '../auth/auth.guard';
import { Event } from '@prisma/client';

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
  async create(@Body() data: CreateEventDto, @UploadedFile() image: Express.Multer.File, @Req() req: RequestWithUser): Promise<Event> {
    const id = req.user.sub
    data.userId = id
    data = await parseData(data, image)
    return this.eventsService.create(data)
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: EventEntity })
  @ApiBody({ type: UpdateEventDto })
  @UseInterceptors(ImageInterceptor.create('events'))
  @ApiConsumes('multipart/form-data')
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateEventDto, @UploadedFile() image: Express.Multer.File): Promise<Event> {
    data = await parseData(data, image)
    return this.eventsService.update(id, data)
  }


  @Get()
  @ApiBearerAuth()
  @ApiOkResponse({ type: EventEntity, isArray: true })
  async findAll(): Promise<Event[]> {
    const events = await this.eventsService.findAll()
    if (events.length === 0) throw new NotFoundException(`no one ${route} find`)
    return events;
  }


  @Get('mines')
  @ApiBearerAuth()
  @ApiOkResponse({ type: EventEntity })
  async findMine(@Req() req: RequestWithUser): Promise<Event[]> {
    const id = req.user.sub
    return this.eventsService.findAllByUserId(id)
  }

  @Get('igo')
  @ApiBearerAuth()
  @ApiOkResponse({ type: EventEntity })
  async findIgo(@Req() req: RequestWithUser): Promise<Event[]> {
    const id = req.user.sub
    return this.eventsService.findAllByParticipantId(id)
  }


  @Get('validated')
  @ApiBearerAuth()
  @ApiOkResponse({ type: EventEntity })
  async findAllValidated(): Promise<Event[]> {
    return this.eventsService.findAllValidated()
  }

  @Get('user/:id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: EventEntity })
  async findByUserId(@Param('id', ParseIntPipe) id: number): Promise<Event[]> {
    return this.eventsService.findAllByUserId(id)
  }

  @Get('participant/:id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: EventEntity })
  async findByParticipantId(@Param('id', ParseIntPipe) id: number): Promise<Event[]> {
    return this.eventsService.findAllByParticipantId(id)
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: EventEntity })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Event> {
    return this.eventsService.findOne(id)
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: EventEntity })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<Event> {
    return this.eventsService.remove(id)
  }

}
