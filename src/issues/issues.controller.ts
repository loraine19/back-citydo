import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UploadedFile, UseInterceptors, ParseIntPipe, Query, DefaultValuePipe, Put } from '@nestjs/common';
import { IssuesService } from './issues.service';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiOkResponse, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { parseData } from 'middleware/BodyParser';
import { IssueEntity } from './entities/issue.entity';
import { ImageInterceptor } from '../../middleware/ImageInterceptor';
import { User } from 'middleware/decorators';
import { Issue, IssueStep } from '@prisma/client';

@ApiTags('issues')
@Controller('issues')
@UseGuards(AuthGuard)
export class IssuesController {
  constructor(private readonly issuesService: IssuesService) { }

  @Post()
  @ApiBearerAuth()
  @ApiOkResponse({ type: IssueEntity })
  @ApiBody({ type: CreateIssueDto })
  @UseInterceptors(ImageInterceptor.create('issue'))
  @ApiConsumes('multipart/form-data')
  async create(
    @Body() data: any,
    @UploadedFile() image: Express.Multer.File,
    @User() userId: number) {
    data.userid && (data.userId = userId);
    data = await parseData(data, image)
    return this.issuesService.create(data);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: IssueEntity })
  @ApiBody({ type: UpdateIssueDto })
  @UseInterceptors(ImageInterceptor.create('issue'))
  @ApiConsumes('multipart/form-data')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateIssueDto,
    @UploadedFile() image: Express.Multer.File,
    @User() userId: number) {
    const issue = await this.issuesService.findOneById(id, userId);
    if (issue.image && data.image) {
      ImageInterceptor.deleteImage(issue.image);
    }
    data.userId = userId;
    data = await parseData(data, image)
    return this.issuesService.update(id, data, userId);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: IssueEntity })
  async updateStep(
    @Param('id', ParseIntPipe) id: number,
    @Query('step') step: IssueStep,
    @User() userId: number,
    @Body() data: { pourcent: number }): Promise<Issue> {
    if (step) {
      return this.issuesService.updateValidModo(id, userId);
    }
    return this.issuesService.updateFinish(id, userId, data.pourcent,);
  }

  @Get()
  @ApiBearerAuth()
  async findAll(
    @User() userId: any,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('filter') filter?: any): Promise<{ issues: Issue[], count: number }> {
    console.log(filter, 'filter controller')
    return await this.issuesService.findAll(userId, page, filter);
  }

  @Get(':id')
  @ApiBearerAuth()
  findOneById(
    @Param('id', ParseIntPipe) id: number,
    @User() userId: number) {
    return this.issuesService.findOneById(id, userId);
  }

  @Delete(':id')
  @ApiBearerAuth()
  remove(
    @Param('id', ParseIntPipe) id: number,
    @User() userId: number) {
    return this.issuesService.remove(id, userId);
  }

}
