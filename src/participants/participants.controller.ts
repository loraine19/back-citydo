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
  constructor(private readonly participantsService: ParticipantsService) { }

  @Post()
  @ApiBearerAuth()
  @ApiResponse({ type: ParticpantEntity })
  async create(
    @Body() data: CreateParticipantDto,
    @Req() req: RequestWithUser): Promise<any> {
    data.userId = req.user.sub
    return this.participantsService.create(data)
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
