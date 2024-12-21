import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, ParseIntPipe, Req, UploadedFile, UseInterceptors, } from '@nestjs/common';
import { ApiOkResponse, ApiTags, ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventEntity } from './entities/event.entity';
import { EventsService } from './events.service';
import { ImageInterceptor } from '../../middleware/ImageInterceptor';
import { parseData } from '../../middleware/BodyParser';
import { RequestWithUser } from 'src/auth/auth.entities/auth.entity';

const route = 'events'
@Controller(route)
@ApiTags(route)
export class EventsController {
  constructor(private readonly eventsService: EventsService) { }
  @Post()
  @ApiOkResponse({ type: EventEntity })
  @ApiBody({ type: CreateEventDto })
  @UseInterceptors(ImageInterceptor.create('events'))
  @ApiConsumes('multipart/form-data')
  async create(@Body() data: CreateEventDto, @UploadedFile() image: Express.Multer.File,): Promise<CreateEventDto> {
    data = await parseData(data, image)
    return this.eventsService.create(data)
  }

  @Patch(':id')
  @ApiOkResponse({ type: EventEntity })
  @ApiBody({ type: UpdateEventDto })
  @UseInterceptors(ImageInterceptor.create('events'))
  @ApiConsumes('multipart/form-data', 'application/json')
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateEventDto, @UploadedFile() image: Express.Multer.File): Promise<UpdateEventDto> {
    data = await parseData(data, image)
    return this.eventsService.update(id, data)

  }


  @Get()
  @ApiOkResponse({ type: EventEntity, isArray: true })
  async findAll() {
    const events = await this.eventsService.findAll()
    if (events.length === 0) throw new NotFoundException(`no one ${route} find`)
    return events;
  }

  @Get(':id')
  @ApiOkResponse({ type: EventEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.eventsService.findOne(id)
  }


  @Get('mines')
  @ApiBearerAuth()
  @ApiOkResponse({ type: EventEntity })
  async getProfile(@Req() req: RequestWithUser) {
    const id = req.user.sub
    return this.eventsService.findOne(id)
  }

  @Delete(':id')
  @ApiOkResponse({ type: EventEntity })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<CreateEventDto> {
    return this.eventsService.remove(id)
  }
}
