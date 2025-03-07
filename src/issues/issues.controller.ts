import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, UploadedFile, UseInterceptors, ParseIntPipe, Query, DefaultValuePipe } from '@nestjs/common';
import { IssuesService } from './issues.service';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { RequestWithUser } from 'src/auth/auth.entities/auth.entity';
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiOkResponse, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { parseData } from 'middleware/BodyParser';
import { IssueEntity } from './entities/issue.entity';
import { ImageInterceptor } from '../../middleware/ImageInterceptor';
import { User } from 'middleware/decorators';
import { Issue } from '@prisma/client';

@ApiTags('issues')
@Controller('issues')
@UseGuards(AuthGuard)
export class IssuesController {
  constructor(private readonly issuesService: IssuesService) { }

  @Post()
  @ApiBearerAuth()
  @ApiOkResponse({ type: IssueEntity })
  @ApiBody({ type: CreateIssueDto })
  @UseInterceptors(ImageInterceptor.create('issues'))
  @ApiConsumes('multipart/form-data')
  async create(
    @Body() data: any,
    @UploadedFile() image: Express.Multer.File,
    @Req() req: RequestWithUser) {
    const userId = req.user.sub;
    data.userid && (data.userId = userId);
    data = await parseData(data, image)
    return this.issuesService.create(data);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: IssueEntity })
  @ApiBody({ type: UpdateIssueDto })
  @UseInterceptors(ImageInterceptor.create('issues'))
  @ApiConsumes('multipart/form-data')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateIssueDto, @UploadedFile() image: Express.Multer.File,
    @Req() req: RequestWithUser) {
    const userId = req.user.sub;
    const issue = await this.issuesService.findOneById(id, userId);
    if (issue.image && data.image) {
      ImageInterceptor.deleteImage(issue.image);
    }
    data = await parseData(data, image)
    return this.issuesService.update(id, data, userId);
  }


  @Get()
  @ApiBearerAuth()
  async findAll(
    @User() userId: any,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('filter') filter?: any): Promise<{ issues: Issue[], count: number }> {
    const res = await this.issuesService.findAll(userId, page, filter);
    return res
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
  remove(@Param('id') id: string) {
    return this.issuesService.remove(+id);
  }
}
