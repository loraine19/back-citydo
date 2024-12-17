import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, HttpException, HttpStatus } from '@nestjs/common';
import { VotesService } from './votes.service';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { PostsService } from 'src/posts/posts.service';
import { UsersService } from 'src/users/users.service';
import { VoteEntity } from './entities/vote.entity';
import { $Enums } from '@prisma/client';

const route = "votes"
@Controller(route)
@ApiTags(route)
export class VotesController {
  constructor(private readonly votesService: VotesService, private usersService: UsersService, private postService: PostsService) { }

  @Post()
  @ApiResponse({ type: VoteEntity })
  /// FK user & event 
  async create(@Body() data: CreateVoteDto) {
    return this.votesService.create(data)
  }

  @Get()
  @ApiResponse({ type: VoteEntity, isArray: true })
  async findAll() {
    const votes = await this.votesService.findAll()
    if (!votes.length) throw new HttpException(`no ${route} found`, HttpStatus.NO_CONTENT);
    return votes
  }

  @Get('user:userId&target:target&targetId:targetId')
  @ApiResponse({ type: VoteEntity })
  async findOne(@Param('userId', ParseIntPipe) userId: number, @Param('targetId', ParseIntPipe) targetId: number, @Param('target') target: $Enums.VoteTarget,) {
    return await this.votesService.findOne(userId, targetId, target)
  }

  @Patch('user:userId&target:target&targetId:targetId')
  @ApiResponse({ type: VoteEntity })
  async update(@Param('userId', ParseIntPipe) userId: number, @Param('targetId', ParseIntPipe) targetId: number, @Param('target') target: $Enums.VoteTarget, @Body() data: UpdateVoteDto) {
    const vote = this.votesService.update(userId, targetId, target, data);
    return vote
  }

  @Delete('user:userId&target:target&targetId:targetId')
  @ApiResponse({ type: VoteEntity })
  remove(@Param('userId', ParseIntPipe) userId: number, @Param('targetId', ParseIntPipe) targetId: number, @Param('target') target: $Enums.VoteTarget,) {
    const vote = this.votesService.remove(userId, targetId, target);
    return vote
  }
}
