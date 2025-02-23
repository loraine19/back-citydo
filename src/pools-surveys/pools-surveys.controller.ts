import { Controller, Get, Query, Req, UseGuards, ParseIntPipe } from '@nestjs/common';
import { PoolsSurveysService } from './pools-surveys.service';
import { Pool, Survey } from '@prisma/client';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from 'middleware/decorators';
import { PoolSurveyFilter } from './entities/constant';



const route = "poolsSurveys"
@UseGuards(AuthGuard)
@Controller(route)
@ApiTags(route)
export class PoolsSurveysController {
  constructor(private readonly poolsSurveysService: PoolsSurveysService) { }


  @Get()
  @ApiBearerAuth()
  async findAll(
    @User() userId: number,
    @Query('page') page?: any,
    @Query('filter') filter?: string,
    @Query('step') step?: string): Promise<{ poolsSurveys: (Pool | Survey)[], count: number }> {
    return this.poolsSurveysService.findAll(userId, parseInt(page), filter, step)
  }

}


