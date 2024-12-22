import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, HttpException, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { VotesService } from './votes.service';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { VoteEntity } from './entities/vote.entity';
import { $Enums, Vote } from '@prisma/client';
import { AuthGuard } from '../auth/auth.guard';
import { RequestWithUser } from 'src/auth/auth.entities/auth.entity';

const route = "votes"
@UseGuards(AuthGuard)
@Controller(route)
@ApiTags(route)
export class VotesController {
  constructor(private readonly votesService: VotesService) { }

  @Post()
  @ApiBearerAuth()
  @ApiResponse({ type: VoteEntity })
  async create(@Body() data: CreateVoteDto): Promise<Vote> {
    return this.votesService.create(data)
  }

  @Get()
  @ApiBearerAuth()
  @ApiResponse({ type: VoteEntity, isArray: true })
  async findAll(): Promise<Vote[]> {
    const votes = await this.votesService.findAll()
    if (!votes.length) throw new HttpException(`no ${route} found`, HttpStatus.NO_CONTENT);
    return votes
  }

  @Get('mines')
  @ApiBearerAuth()
  @ApiResponse({ type: VoteEntity, isArray: true })
  async findMines(@Req() req: RequestWithUser): Promise<Vote[]> {
    const userId = req.user.sub
    const votes = await this.votesService.findAllByUserId(userId)
    if (!votes.length) throw new HttpException(`no ${route} found`, HttpStatus.NO_CONTENT);
    return votes
  }

  @Get('user/:userId')
  @ApiBearerAuth()
  @ApiResponse({ type: VoteEntity, isArray: true })
  async findAllByUserId(@Param('userId', ParseIntPipe) userId: number): Promise<Vote[]> {
    const votes = await this.votesService.findAllByUserId(userId)
    if (!votes.length) throw new HttpException(`no ${route} found`, HttpStatus.NO_CONTENT);
    return votes
  }

  @Get('pool')
  @ApiBearerAuth()
  @ApiResponse({ type: VoteEntity, isArray: true })
  async findAllPool(): Promise<Vote[]> {
    const votes = await this.votesService.findAllPool()
    if (!votes.length) throw new HttpException(`no ${route} found`, HttpStatus.NO_CONTENT);
    return votes
  }

  @Get('pool/user/:userId')
  @ApiBearerAuth()
  @ApiResponse({ type: VoteEntity, isArray: true })
  async findAllPoolByUserId(@Param('userId', ParseIntPipe) userId: number): Promise<Vote[]> {
    const votes = await this.votesService.findAllPoolByUserId(userId)
    if (!votes.length) throw new HttpException(`no ${route} found`, HttpStatus.NO_CONTENT);
    return votes
  }

  @Get('survey')
  @ApiBearerAuth()
  @ApiResponse({ type: VoteEntity, isArray: true })
  async findAllSurvey(): Promise<Vote[]> {
    const votes = await this.votesService.findAllSurvey()
    if (!votes.length) throw new HttpException(`no ${route} found`, HttpStatus.NO_CONTENT);
    return votes
  }

  @Get('survey/user/:userId')
  @ApiBearerAuth()
  @ApiResponse({ type: VoteEntity, isArray: true })
  async findAllSurveyByUserId(@Param('userId', ParseIntPipe) userId: number): Promise<Vote[]> {
    const votes = await this.votesService.findAllSurveyByUserId(userId)
    if (!votes.length) throw new HttpException(`no ${route} found`, HttpStatus.NO_CONTENT);
    return votes
  }

  @Get('user:userId&target:target&targetId:targetId')
  @ApiBearerAuth()
  @ApiResponse({ type: VoteEntity })
  async findOne(@Param('userId', ParseIntPipe) userId: number, @Param('targetId', ParseIntPipe) targetId: number, @Param('target') target: $Enums.VoteTarget,): Promise<Vote> {
    return await this.votesService.findOne(userId, targetId, target)
  }

  @Patch('user:userId&target:target&targetId:targetId')
  @ApiBearerAuth()
  @ApiResponse({ type: VoteEntity })
  async update(@Param('userId', ParseIntPipe) userId: number, @Param('targetId', ParseIntPipe) targetId: number, @Param('target') target: $Enums.VoteTarget, @Body() data: UpdateVoteDto): Promise<Vote> {
    const vote = this.votesService.update(userId, targetId, target, data);
    return vote
  }

  @Delete('user:userId&target:target&targetId:targetId')
  @ApiBearerAuth()
  @ApiResponse({ type: VoteEntity })
  remove(@Param('userId', ParseIntPipe) userId: number, @Param('targetId', ParseIntPipe) targetId: number, @Param('target') target: $Enums.VoteTarget,): Promise<Vote> {
    const vote = this.votesService.remove(userId, targetId, target);
    return vote
  }
}
