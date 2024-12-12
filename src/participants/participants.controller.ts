import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, NotFoundException, ParseIntPipe, HttpException } from '@nestjs/common';
import { ParticipantsService } from './participants.service';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from 'src/users/users.service';
import { EventsService } from 'src/events/events.service';
import { ParticpantEntity } from './entities/participant.entity';
import { PrismaFilter } from 'src/prisma/prisma-client-exception.filter';
import { error } from 'console';

const route = "participants"
@Controller(route)
@ApiTags(route)
export class ParticipantsController {
  constructor(private readonly participantsService: ParticipantsService, private usersService: UsersService, private eventsService: EventsService) { }

  @Post()
  @ApiResponse({ type: ParticpantEntity })
  /// FK user & event 
  async create(@Body() data: CreateParticipantDto) {
    const participation = { userId: data.userId, eventId: data.eventId }
    return this.participantsService.create(participation)
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
  async findOne(@Param('userId', ParseIntPipe) userId: number, @Param('eventId', ParseIntPipe) eventId: number) {
    const participant = await this.participantsService.findOne(userId, eventId)
    if (!participant) throw new NotFoundException(`no ${route} found`);
    return participant
  }

  @Patch('user:userId&event:eventId')
  @ApiResponse({ type: ParticpantEntity })
  async update(@Param('userId', ParseIntPipe) userId: number, @Param('eventId', ParseIntPipe) eventId: number, @Body() data: UpdateParticipantDto) {
    const participant = this.participantsService.update(+userId, +eventId, data);
    return participant
  }

  @Delete('user:userId&event:eventId')
  @ApiResponse({ type: ParticpantEntity })
  remove(@Param('userId', ParseIntPipe) userId: number, @Param('eventId', ParseIntPipe) eventId: number) {
    const participant = this.participantsService.remove(+userId, +eventId);
    return participant
  }
}
