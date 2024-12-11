import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, NotFoundException } from '@nestjs/common';
import { ParticipantsService } from './participants.service';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from 'src/users/users.service';

const route = "participants"
@Controller(route)
@ApiTags(route)
export class ParticipantsController {
  constructor(private readonly participantsService: ParticipantsService, private usersService: UsersService) { }

  /// FK 
  @Post()
  async create(@Body() data: CreateParticipantDto) {
    try {
      const find = await this.usersService.findOne(data.userId)
      if (!find) throw new NotFoundException(`no ${route} find`)
      return this.participantsService.create(data);
    }
    catch (error: any) {
      console.log(error);
      return new BadRequestException("error");
    }
  }

  @Get()
  findAll() {
    return this.participantsService.findAll();
  }

  @Get(':userId/:eventId')
  findOne(@Param('userId') userId: string, @Param('eventId') eventId: string) {
    return this.participantsService.findOne(+userId, +eventId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateParticipantDto: UpdateParticipantDto) {
    return this.participantsService.update(+id, +id, updateParticipantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.participantsService.remove(+id, +id);
  }
}
