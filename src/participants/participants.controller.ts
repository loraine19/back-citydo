import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, NotFoundException } from '@nestjs/common';
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
    try {
      const user = await this.usersService.findOne(data.userId)
      const event = await this.eventsService.findOne(data.eventId)
      const participant = { userId: data.userId, eventId: data.eventId }
      const find = await this.participantsService.findOne(data.userId, data.eventId)
      if (find) return new BadRequestException(`participation already exist`);
      if (user && event) return this.participantsService.create(participant)
      else return new NotFoundException(`participation impossible`);

    }
    catch (error: any) {
      console.log(error);
      return new BadRequestException(error.message);
    }
  }

  @Get()
  async findAll() {
    const data = await this.participantsService.findAll()
    return data ? data : new NotFoundException(`no ${route} find`);
  }

  @Get(':userId&:eventId')
  findOne(@Param('userId') userId: string, @Param('eventId') eventId: string) {
    return this.participantsService.findOne(+userId, +eventId);
  }

  @Patch(':userId&:eventId')
  update(@Param('userId') userId: string, @Param('eventId') eventId: string, @Body() updateParticipantDto: UpdateParticipantDto) {
    return this.participantsService.update(+userId, +eventId, updateParticipantDto);
  }

  @Delete(':userId&:eventId')
  remove(@Param('userId') userId: string, @Param('eventId') eventId: string) {
    return this.participantsService.remove(+userId, +eventId);
  }
}
