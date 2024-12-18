import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Req } from '@nestjs/common';
import { PoolsService } from './pools.service';
import { CreatePoolDto } from './dto/create-pool.dto';
import { UpdatePoolDto } from './dto/update-pool.dto';
import { ApiBearerAuth, ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import { PoolEntity } from './entities/pool.entity';
import { RequestWithUser } from 'src/auth/auth.entities/auth.entity';
import { ProfileEntity } from 'src/profiles/entities/profile.entity';

const route = "pools"
@Controller(route)

export class PoolsController {
  constructor(private readonly poolsService: PoolsService) { }

  @Post()
  @ApiResponse({ type: PoolEntity })
  create(@Body() data: CreatePoolDto) {
    return this.poolsService.create(data);
  }

  @Get()
  @ApiResponse({ type: PoolEntity, isArray: true })
  findAll() {
    return this.poolsService.findAll();
  }

  @Get(':id')
  @ApiResponse({ type: PoolEntity })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.poolsService.findOne(+id);
  }

  @Get('mines')
  @ApiBearerAuth()
  @ApiOkResponse({ type: ProfileEntity })
  async getProfile(@Req() req: RequestWithUser) {
    const id = req.user.sub
    return this.poolsService.findOne(id)
  }

  @Patch(':id')
  @ApiResponse({ type: PoolEntity })
  update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdatePoolDto) {
    return this.poolsService.update(id, data);
  }

  @Delete(':id')
  @ApiResponse({ type: PoolEntity })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.poolsService.remove(id);
  }
}
