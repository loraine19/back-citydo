import { Controller, Get, Post, Body, Patch, Param, Delete, Req, ParseIntPipe } from '@nestjs/common';
import { SurveysService } from './surveys.service';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { UpdateSurveyDto } from './dto/update-survey.dto';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { SurveyEntity } from './entities/survey.entity';
import { RequestWithUser } from 'src/auth/auth.entities/auth.entity';

@Controller('surveys')
export class SurveysController {
  constructor(private readonly surveysService: SurveysService) { }

  @Post()
  @ApiOkResponse({ type: SurveyEntity })
  create(@Body() createSurveyDto: CreateSurveyDto) {
    return this.surveysService.create(createSurveyDto);
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

  @Patch(':id')
  @ApiOkResponse({ type: SurveyEntity })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateSurveyDto: UpdateSurveyDto) {
    return this.surveysService.update(+id, updateSurveyDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: SurveyEntity })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.surveysService.remove(+id);
  }
}
