import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, NotFoundException, ParseIntPipe } from '@nestjs/common';
import { ParticipantsService } from './participants.service';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from 'src/users/users.service';
import { EventsService } from 'src/events/events.service';
import { ParticpantEntity } from './entities/participant.entity';

const route = "participants"
@Controller(route)
@ApiTags(route)
export class ParticipantsController {
  constructor(private readonly participantsService: ParticipantsService, private usersService: UsersService, private eventsService: EventsService) { }


  @Post()
  @ApiResponse({ type: ParticpantEntity })
  /// FK user & event 
  async create(@Body() data: CreateParticipantDto) {
    const user = await this.usersService.findOne(data.userId)
    const event = await this.eventsService.findOne(data.eventId)
    const participation = { userId: data.userId, eventId: data.eventId }
    const find = await this.participantsService.findOne(data.userId, data.eventId)
    if (find) return new BadRequestException(`participation already exist`);
    if (!user || !event) throw new NotFoundException(`participation impossible`);
    const participant = await this.participantsService.create(participation)
    return { participant }
  }

  @Get()
  @ApiResponse({ type: ParticpantEntity, isArray: true })
  async findAll() {
    const participant = await this.participantsService.findAll()
    if (!participant) throw new NotFoundException(`no ${route} found`);
    return { participant }
  }

  @Get('user:userId&event:eventId')
  @ApiResponse({ type: ParticpantEntity })
  findOne(@Param('userId', ParseIntPipe) userId: number, @Param('eventId', ParseIntPipe) eventId: number) {
    const participant = this.participantsService.findOne(userId, eventId)
    if (!participant) throw new NotFoundException(`no ${route} found`);
    return participant
  }

  @Patch('user:userId&event:eventId')
  @ApiResponse({ type: ParticpantEntity })
  async update(@Param('userId', ParseIntPipe) userId: number, @Param('eventId', ParseIntPipe) eventId: number, @Body() data: UpdateParticipantDto) {
    const user = await this.usersService.findOne(data.userId)
    const event = await this.eventsService.findOne(data.eventId)
    if (!user || !event) throw new NotFoundException(`participation impossible`);
    const find = await this.participantsService.findOne(data.userId, data.eventId)
    if (find) return new BadRequestException(`participation already exist`);
    const participant = this.participantsService.update(+userId, +eventId, data);
    if (!participant) throw new NotFoundException(`no ${route} found`);
    return { participant }
  }

  @Delete('user:userId&event:eventId')
  @ApiResponse({ type: ParticpantEntity })
  remove(@Param('userId', ParseIntPipe) userId: number, @Param('eventId', ParseIntPipe) eventId: number) {
    const participant = this.participantsService.remove(+userId, +eventId);
    if (!participant) throw new NotFoundException(`no ${route} found`);
    return { participant }
  }
}
