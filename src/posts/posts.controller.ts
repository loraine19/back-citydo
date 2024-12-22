import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UploadedFile, UseInterceptors, HttpException, NotFoundException, UseGuards, Req } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiOkResponse, ApiBody, ApiConsumes, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { parseData } from '../../middleware/BodyParser';
import { ImageInterceptor } from '../../middleware/ImageInterceptor';
import { PostEntity } from './entities/post.entity';
import { AuthGuard } from '../auth/auth.guard';
import { RequestWithUser } from 'src/auth/auth.entities/auth.entity';

const route = 'posts'
ApiTags(route)
@Controller(route)
@UseGuards(AuthGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @Post()
  @ApiBearerAuth()
  @ApiOkResponse({ type: PostEntity })
  @ApiBody({ type: CreatePostDto })
  @UseInterceptors(ImageInterceptor.create('posts'))
  @ApiConsumes('multipart/form-data', 'application/json')
  async create(@Body() data: CreatePostDto, @UploadedFile() image: Express.Multer.File,): Promise<PostEntity> {
    data = await parseData(data, image)
    return this.postsService.create(data)
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: PostEntity })
  @ApiBody({ type: UpdatePostDto })
  @UseInterceptors(ImageInterceptor.create('posts'))
  @ApiConsumes('multipart/form-data', 'application/json')
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdatePostDto, @UploadedFile() image: Express.Multer.File): Promise<PostEntity> {
    data = await parseData(data, image)
    return this.postsService.update(id, data)
  }

  @Get()
  @ApiBearerAuth()
  @ApiOkResponse({ type: PostEntity, isArray: true })
  async findAll(): Promise<PostEntity[]> {
    const posts = await this.postsService.findAll()
    if (posts.length === 0) throw new NotFoundException(`no one ${route} find`)
    return posts
  }

  @Get(':id')
  @ApiBearerAuth()
  findOne(@Param('id', ParseIntPipe) id: number): Promise<PostEntity> {
    return this.postsService.findOne(id);
  }

  @Get('mines')
  @ApiBearerAuth()
  @ApiOkResponse({ type: PostEntity, isArray: true })
  async findMines(@Req() req: RequestWithUser): Promise<PostEntity[]> {
    const userId = req.user.sub
    return this.postsService.findAllByUserId(userId)
  }

  @Get('user/:userId')
  @ApiBearerAuth()
  @ApiOkResponse({ type: PostEntity, isArray: true })
  async findAllByUserId(@Param('userId', ParseIntPipe) userId: number): Promise<PostEntity[]> {
    return this.postsService.findAllByUserId(userId)
  }

  @Delete(':id')
  @ApiBearerAuth()
  remove(@Param('id', ParseIntPipe) id: number): Promise<PostEntity> {
    return this.postsService.remove(id);
  }
}
