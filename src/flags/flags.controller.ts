import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, UseGuards, Query } from '@nestjs/common';
import { FlagsService } from './flags.service';
import { CreateFlagDto } from './dto/create-flag.dto';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { FlagEntity } from './entities/flag.entity';
import { $Enums, Flag } from '@prisma/client';
import { AuthGuard } from '../auth/auth.guard';
import { User } from 'middleware/decorators';

const route = "flags"
@UseGuards(AuthGuard)
@Controller(route)
@ApiTags(route)
export class FlagsController {
  constructor(private readonly flagsService: FlagsService) { }

  //// Create a new flag
  @Post()
  @ApiBearerAuth()
  @ApiResponse({ type: FlagEntity })
  async create(
    @Body() data: CreateFlagDto,
    @User() userId: number): Promise<Flag> {
    data.userId = userId
    return this.flagsService.create(data)
  }

  //// Retrieve all flags
  @Get()
  @ApiBearerAuth()
  @ApiResponse({ type: FlagEntity, isArray: true })
  async findAll(
    @User() userId: number,
    @Query() filter?: $Enums.FlagTarget): Promise<Flag[]> {
    return await this.flagsService.findAll(userId)
  }

  //// Retrieve a specific flag by userId, target, and targetId
  @Get('/:targetId/:target')
  @ApiBearerAuth()
  @ApiResponse({ type: FlagEntity })
  async findOne(
    @User() userId: number,
    @Param('targetId', ParseIntPipe) targetId: number, @Param('target') target: $Enums.FlagTarget,): Promise<Flag> {
    return await this.flagsService.findOne(userId, targetId, target)
  }




  @Delete(':targetId/:target')
  @ApiBearerAuth()
  async removeMine(
    @Param('targetId', ParseIntPipe) targetId: number, @Param('target') target: $Enums.FlagTarget,
    @User() userId: number): Promise<{ message: string }> {
    const flag = await this.flagsService.remove(userId, targetId, target);
    return { message: 'Votre signalement a été supprimé avec succès' }
  }
}
