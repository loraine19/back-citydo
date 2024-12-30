import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, NotFoundException, ParseIntPipe, HttpException, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { ParticipantsService } from './participants.service';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from '../users/users.service';
import { EventsService } from '../events/events.service';
import { AuthGuard } from '../auth/auth.guard';
import { Participant } from '@prisma/client'
import { ParticpantEntity } from './entities/participant.entity';
import { RequestWithUser } from 'src/auth/auth.entities/auth.entity';



const route = "participants"
@UseGuards(AuthGuard)
@Controller(route)
@ApiTags(route)
export class ParticipantsController {
  constructor(private readonly participantsService: ParticipantsService, private usersService: UsersService, private eventsService: EventsService) { }

  @Post()
  @ApiBearerAuth()
  @ApiResponse({ type: ParticpantEntity })
  async create(@Body() data: CreateParticipantDto, @Req() req: RequestWithUser): Promise<Participant> {
    const id = req.user.sub
    data.userId = id
    return this.participantsService.create(data)
  }

  @Get()
  @ApiBearerAuth()
  @ApiResponse({ type: ParticpantEntity, isArray: true })
  async findAll(): Promise<Participant[]> {
    const participants = await this.participantsService.findAll()
    if (!participants.length) throw new HttpException(`no ${route} found`, HttpStatus.NO_CONTENT);
    return participants
  }


  @Get('user:userId&event:eventId')
  @ApiBearerAuth()
  @ApiResponse({ type: ParticpantEntity })
  async findOne(@Param('userId', ParseIntPipe) userId: number, @Param('eventId', ParseIntPipe) eventId: number): Promise<Participant> {
    return await this.participantsService.findOne(userId, eventId)
  }

  @Patch('user:userId&event:eventId')
  @ApiBearerAuth()
  @ApiResponse({ type: ParticpantEntity })
  async update(@Param('userId', ParseIntPipe) userId: number, @Param('eventId', ParseIntPipe) eventId: number, @Body() data: UpdateParticipantDto): Promise<Participant> {
    const participant = this.participantsService.update(+userId, +eventId, data);
    return participant
  }

  @Delete('user:userId/event:eventId')
  @ApiBearerAuth()
  @ApiResponse({ type: ParticpantEntity })
  remove(@Param('userId', ParseIntPipe) userId: number, @Param('eventId', ParseIntPipe) eventId: number): Promise<Participant> {
    const participant = this.participantsService.remove(userId, eventId);
    return participant
  }


  @Delete('event:eventId')
  @ApiBearerAuth()
  @ApiResponse({ type: ParticpantEntity })
  async removeByUser(@Param('eventId', ParseIntPipe) eventId: number, @Req() req: RequestWithUser): Promise<Participant> {
    const userId = req.user.sub
    const participant = this.participantsService.remove(userId, eventId);
    return participant
  }

}
