import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Req, UseGuards } from '@nestjs/common';
import { PoolsService } from './pools.service';
import { CreatePoolDto } from './dto/create-pool.dto';
import { UpdatePoolDto } from './dto/update-pool.dto';
import { ApiBearerAuth, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PoolEntity } from './entities/pool.entity';
import { RequestWithUser } from '../auth/auth.entities/auth.entity';
import { AuthGuard } from '../auth/auth.guard';
import { Pool } from '@prisma/client';

const route = "pools"
@UseGuards(AuthGuard)
@Controller(route)
@ApiTags(route)
export class PoolsController {
  constructor(private readonly poolsService: PoolsService) { }

  @Post()
  @ApiBearerAuth()
  @ApiResponse({ type: PoolEntity })
  create(@Body() data: CreatePoolDto): Promise<Pool> {
    return this.poolsService.create(data);
  }

  @Get()
  @ApiBearerAuth()
  @ApiResponse({ type: PoolEntity, isArray: true })
  findAll(): Promise<Pool[]> {
    return this.poolsService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiResponse({ type: PoolEntity })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Pool> {
    return this.poolsService.findOne(id);
  }

  @Get('mines')
  @ApiBearerAuth()
  @ApiOkResponse({ type: PoolEntity })
  async findMines(@Req() req: RequestWithUser): Promise<Pool[]> {
    const id = req.user.sub
    return this.poolsService.findAllByUserId(id)
  }

  @Get('user/:id')
  @ApiBearerAuth()
  @ApiResponse({ type: PoolEntity })
  findAllByUserId(@Param('id', ParseIntPipe) id: number): Promise<Pool[]> {
    return this.poolsService.findAllByUserId(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiResponse({ type: PoolEntity })
  update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdatePoolDto): Promise<Pool> {
    return this.poolsService.update(id, data);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiResponse({ type: PoolEntity })
  remove(@Param('id', ParseIntPipe) id: number): Promise<Pool> {
    return this.poolsService.remove(id);
  }
}
