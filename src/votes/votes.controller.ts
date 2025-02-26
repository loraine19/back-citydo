import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, HttpException, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { VotesService } from './votes.service';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { VoteEntity } from './entities/vote.entity';
import { $Enums, Vote } from '@prisma/client';
import { AuthGuard } from '../auth/auth.guard';
import { RequestWithUser } from 'src/auth/auth.entities/auth.entity';
import { User } from 'middleware/decorators';

const route = "votes"
@UseGuards(AuthGuard)
@Controller(route)
@ApiTags(route)
export class VotesController {
  constructor(private readonly votesService: VotesService) { }

  @Post()
  @ApiBearerAuth()
  @ApiResponse({ type: VoteEntity })
  async create(
    @Body() data: CreateVoteDto,
    @User() userId: number): Promise<Vote> {
    data.userId = userId
    console.log(data)
    return this.votesService.create(data)
  }



  @Patch()
  @ApiBearerAuth()
  @ApiResponse({ type: VoteEntity })
  async update(
    @Body() data: UpdateVoteDto,
    @User() userId: number): Promise<Vote> {
    const vote = this.votesService.update(userId, data);
    return vote
  }


}
