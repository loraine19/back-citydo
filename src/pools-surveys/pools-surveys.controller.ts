import { Controller, Get, Req, UseGuards, } from '@nestjs/common';
import { PoolsSurveysService } from './pools-surveys.service';
import { RequestWithUser } from 'src/auth/auth.entities/auth.entity';
import { Pool, Survey } from '@prisma/client';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('pools-surveys')
export class PoolsSurveysController {
  constructor(private readonly poolsSurveysService: PoolsSurveysService) { }


  @Get()
  async findAll(@Req() req: RequestWithUser): Promise<(Pool | Survey)[]> {
    const userId = req.user.sub
    return this.poolsSurveysService.findAll(userId);
  }

  @ApiBearerAuth()
  @Get('mines')
  async findMines(@Req() req: RequestWithUser): Promise<(Pool | Survey)[]> {
    const userId = req.user.sub
    return this.poolsSurveysService.findAllByUserId(userId)
  }

  @ApiBearerAuth()
  @Get('new')
  async findNew(@Req() req: RequestWithUser): Promise<(Pool | Survey)[]> {
    const userId = req.user.sub
    return this.poolsSurveysService.findAllNew(userId)
  }
}


