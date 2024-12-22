import { Controller, Get, Post, Body, Patch, Param, Delete, Req, ParseIntPipe, UploadedFile, UseInterceptors, UseGuards } from '@nestjs/common';
import { SurveysService } from './surveys.service';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { UpdateSurveyDto } from './dto/update-survey.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SurveyEntity } from './entities/survey.entity';
import { RequestWithUser } from '../auth/auth.entities/auth.entity';
import { parseData } from '../../middleware/BodyParser';
import { ImageInterceptor } from '../../middleware/ImageInterceptor';
import { AuthGuard } from '../auth/auth.guard';
import { Survey } from '@prisma/client';

const route = 'surveys'
@ApiTags(route)
@Controller(route)
@UseGuards(AuthGuard)
export class SurveysController {
  constructor(private readonly surveysService: SurveysService) { }

  @Post()
  @ApiBearerAuth()
  @ApiOkResponse({ type: SurveyEntity })
  @ApiBody({ type: CreateSurveyDto })
  @UseInterceptors(ImageInterceptor.create('survey'))
  @ApiConsumes('multipart/form-data', 'application/json')
  async create(@Body() data: CreateSurveyDto, @UploadedFile() image: Express.Multer.File,): Promise<Survey> {
    data = await parseData(data, image)
    return this.surveysService.create(data)
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: SurveyEntity })
  @ApiBody({ type: UpdateSurveyDto })
  @UseInterceptors(ImageInterceptor.create('survey'))
  @ApiConsumes('multipart/form-data', 'application/json')
  update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateSurveyDto, @UploadedFile() image: Express.Multer.File,): Promise<Survey> {
    data = parseData(data, image)
    return this.surveysService.update(id, data);
  }


  @Get()
  @ApiBearerAuth()
  @ApiOkResponse({ type: SurveyEntity, isArray: true })
  findAll(): Promise<Survey[]> {
    return this.surveysService.findAll();
  }




  @Get(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: SurveyEntity })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Survey> {
    return this.surveysService.findOne(id);
  }
  @Get('mines')
  @ApiBearerAuth()
  @ApiOkResponse({ type: SurveyEntity })
  async findMines(@Req() req: RequestWithUser): Promise<Survey[]> {
    const id = req.user.sub
    return this.surveysService.findAllByUserId(id)
  }

  @Get('user/:id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: SurveyEntity })
  async findAllByUserId(@Param('id', ParseIntPipe) userId: number): Promise<Survey[]> {
    return this.surveysService.findAllByUserId(userId)
  }


  @Delete(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: SurveyEntity })
  remove(@Param('id', ParseIntPipe) id: number): Promise<Survey> {
    return this.surveysService.remove(id);
  }
}
