import { Controller, Post, Body, Patch, UseGuards } from '@nestjs/common';
import { VotesService } from './votes.service';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { VoteEntity } from './entities/vote.entity';
import { Vote } from '@prisma/client';
import { AuthGuard } from '../auth/auth.guard';
import { User } from 'middleware/decorators';
import { timeStamp } from 'console';

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
