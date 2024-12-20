import { Controller, Get, Post, Body, Patch, Param, Delete, Req, ParseIntPipe, UploadedFile, UseInterceptors } from '@nestjs/common';
import { SurveysService } from './surveys.service';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { UpdateSurveyDto } from './dto/update-survey.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOkResponse } from '@nestjs/swagger';
import { SurveyEntity } from './entities/survey.entity';
import { RequestWithUser } from 'src/auth/auth.entities/auth.entity';
import { parseData } from 'middleware/BodyParser';
import { ImageInterceptor } from 'middleware/ImageInterceptor';

@Controller('surveys')
export class SurveysController {
  constructor(private readonly surveysService: SurveysService) { }

  @Post()
  @ApiOkResponse({ type: SurveyEntity })
  @ApiBody({ type: CreateSurveyDto })
  @UseInterceptors(ImageInterceptor.create('survey'))
  @ApiConsumes('multipart/form-data', 'application/json')
  async create(@Body() data: CreateSurveyDto, @UploadedFile() image: Express.Multer.File,): Promise<CreateSurveyDto> {
    data = await parseData(data, image)
    return this.surveysService.create(data)
  }

  @Patch(':id')
  @ApiOkResponse({ type: SurveyEntity })
  @ApiBody({ type: UpdateSurveyDto })
  @UseInterceptors(ImageInterceptor.create('survey'))
  @ApiConsumes('multipart/form-data', 'application/json')
  update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateSurveyDto, @UploadedFile() image: Express.Multer.File,): Promise<UpdateSurveyDto> {
    data = parseData(data, image)
    return this.surveysService.update(id, data);
  }


  @Get()
  @ApiOkResponse({ type: SurveyEntity, isArray: true })
  findAll() {
    return this.surveysService.findAll();
  }


  @Get(':id')
  @ApiOkResponse({ type: SurveyEntity })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.surveysService.findOne(+id);
  }
  @Get(':id/withVotes')
  @ApiOkResponse({ type: SurveyEntity })
  findOneWithVote(@Param('id', ParseIntPipe) id: number) {
    return this.surveysService.findOneWithVote(id);
  }

  @Get('mines')
  @ApiBearerAuth()
  @ApiOkResponse({ type: SurveyEntity })
  async getMines(@Req() req: RequestWithUser) {
    const id = req.user.sub
    return this.surveysService.findSome(id)
  }

  @Delete(':id')
  @ApiOkResponse({ type: SurveyEntity })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.surveysService.remove(+id);
  }
}
