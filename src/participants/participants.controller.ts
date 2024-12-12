import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, NotFoundException, ParseIntPipe } from '@nestjs/common';
import { ParticipantsService } from './participants.service';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from 'src/users/users.service';
import { EventsService } from 'src/events/events.service';
import { Participant } from 'src/class';

const route = "participants"
@Controller(route)
@ApiTags(route)
export class ParticipantsController {
  constructor(private readonly participantsService: ParticipantsService, private usersService: UsersService, private eventsService: EventsService) { }

  /// FK 
  @Post()
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
  async findAll() {
    const participant = await this.participantsService.findAll()
    if (!participant) throw new NotFoundException(`no ${route} found`);
    return { participant }
  }

  @Get(':userId&:eventId')
  findOne(@Param('userId', ParseIntPipe) userId: number, @Param('eventId', ParseIntPipe) eventId: number) {
    const participant = this.participantsService.findOne(+userId, +eventId)
    if (!participant) throw new NotFoundException(`no ${route} found`);
    return { participant }
  }

  @Patch(':userId&:eventId')
  update(@Param('userId', ParseIntPipe) userId: number, @Param('eventId', ParseIntPipe) eventId: number, @Body() updateParticipantDto: UpdateParticipantDto) {
    const participant = this.participantsService.update(+userId, +eventId, updateParticipantDto);
    if (!participant) throw new NotFoundException(`no ${route} found`);
    return { participant }
  }

  @Delete(':userId&:eventId')
  remove(@Param('userId', ParseIntPipe) userId: number, @Param('eventId', ParseIntPipe) eventId: number) {
    const participant = this.participantsService.remove(+userId, +eventId);
    if (!participant) throw new NotFoundException(`no ${route} found`);
    return { participant }
  }
}
