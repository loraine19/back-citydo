import { Controller, Get, Query, Req, UseGuards, ParseIntPipe, Post, Body, Delete, Param, Patch, UploadedFile, UseInterceptors } from '@nestjs/common';
import { PoolsSurveysService } from './pools-surveys.service';
import { Pool, Survey } from '@prisma/client';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from 'middleware/decorators';
import { parseData } from 'middleware/BodyParser';
import { ImageInterceptor } from 'middleware/ImageInterceptor';
import { CreatePoolDto } from './dto/create-pool.dto';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { PoolEntity } from './dto/pool.entity';
import { SurveyEntity } from './dto/survey.entity';
import { UpdatePoolDto } from './dto/update-pool.dto';
import { UpdateSurveyDto } from './dto/update-survey.dto';
import { PoolSurveyFilter, PoolSurveysFindParams, PoolSurveySort, PoolSurveyStep } from './entities/constant';



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
    @Query('filter') filter?: PoolSurveyFilter,
    @Query('step') step?: PoolSurveyStep,
    @Query('sort') sort?: PoolSurveySort,
    @Query('reverse') reverse?: boolean,
    @Query('search') search?: string,
    @Query('groupId') groupId?: string,
  ): Promise<{ poolsSurveys: (Pool | Survey)[], count: number }> {
    const params: PoolSurveysFindParams = { filter, step, sort, reverse, search, groupId: parseInt(groupId) }
    return this.poolsSurveysService.findAll(userId, parseInt(page), params);
  }

  ///POOLS
  @Post('pool')
  @ApiBearerAuth()
  @ApiResponse({ type: PoolEntity })
  createPool(
    @Body() data: CreatePoolDto,
    @User() userId: number): Promise<Pool> {
    data.userId = userId
    data = parseData(data)
    return this.poolsSurveysService.createPool(data);
  }


  @Get('pool/:id')
  @ApiBearerAuth()
  @ApiResponse({ type: PoolEntity })
  findOnePool(
    @Param('id', ParseIntPipe) id: number,
    @User() userId: number): Promise<Pool> {
    return this.poolsSurveysService.findOnePool(id, userId);
  }


  @Patch('pool/:id')
  @ApiBearerAuth()
  @ApiResponse({ type: PoolEntity })
  updatePool(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: any,
    @User() userId: number): Promise<Pool> {
    data.userId = userId
    data = parseData(data)
    return this.poolsSurveysService.updatePool(id, data);
  }

  @Delete('pool/:id')
  @ApiBearerAuth()
  @ApiResponse({ type: PoolEntity })
  removePool(
    @Param('id', ParseIntPipe) id: number,
    @User() userId: number): Promise<Pool> {
    return this.poolsSurveysService.removePool(id, userId);
  }

  ///SURVEYS 
  @Post('survey')
  @ApiBearerAuth()
  @ApiOkResponse({ type: SurveyEntity })
  @ApiBody({ type: CreateSurveyDto })
  @UseInterceptors(ImageInterceptor.create('survey'))
  @ApiConsumes('multipart/form-data', 'application/json')
  async create(
    @Body() data: CreateSurveyDto,
    @UploadedFile() image: Express.Multer.File,
    @User() userId: number): Promise<Survey> {
    data.userId = userId
    data = await parseData(data, image)
    return this.poolsSurveysService.createSurvey(data)
  }

  @Patch('survey/:id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: SurveyEntity })
  @ApiBody({ type: UpdateSurveyDto })
  @UseInterceptors(ImageInterceptor.create('survey'))
  @ApiConsumes('multipart/form-data', 'application/json')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateSurveyDto,
    @UploadedFile() image: Express.Multer.File,
    @User() userId: number): Promise<Survey> {
    const survey = await this.poolsSurveysService.findOneSurvey(id, userId)
    survey.image && image && ImageInterceptor.deleteImage(survey.image)
    data = parseData(data, image)
    return this.poolsSurveysService.updateSurvey(id, data);
  }



  @Get('survey/:id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: SurveyEntity })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @User() userId: number): Promise<Survey> {
    return this.poolsSurveysService.findOneSurvey(id, userId);
  }



  @Delete('survey/:id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: SurveyEntity })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @User() userId: number): Promise<Survey> {
    return this.poolsSurveysService.removeSurvey(id, userId);
  }

}


