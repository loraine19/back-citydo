import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UploadedFile, UseInterceptors, UseGuards, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiOkResponse, ApiBody, ApiConsumes, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { parseData } from '../../middleware/BodyParser';
import { ImageInterceptor } from '../../middleware/ImageInterceptor';
import { PostEntity } from './entities/post.entity';
import { AuthGuard } from '../auth/auth.guard';
import { User } from 'middleware/decorators';
import { PostFilter, PostSort } from './entities/constant';
import { PostCategory, Post as PostI } from '@prisma/client'

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
  @UseInterceptors(ImageInterceptor.create('post'))
  @ApiConsumes('multipart/form-data', 'application/json')
  async create(
    @Body() data: CreatePostDto,
    @UploadedFile() image: Express.Multer.File,
    @User() userId: number): Promise<PostEntity> {
    try {
      data.userId = userId
      data = await parseData(data, image)
      return this.postsService.create(data)
    }
    catch (error) {
      console.log(error)
    }
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: PostEntity })
  @ApiBody({ type: UpdatePostDto })
  @UseInterceptors(ImageInterceptor.create('post'))
  @ApiConsumes('multipart/form-data', 'application/json')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdatePostDto,
    @UploadedFile() image: Express.Multer.File,
    @User() userId: number): Promise<PostEntity> {
    data.userId = userId
    const post = await this.postsService.findOne(id, data.userId)
    post.image && image && ImageInterceptor.deleteImage(post.image, 'post')
    data = await parseData(data, image)
    return this.postsService.update(id, data)
  }

  @Get()
  @ApiBearerAuth()
  @ApiOkResponse({ type: PostEntity, isArray: true })
  async findAll(
    @User() userId: number,
    @Query('page', ParseIntPipe) page?: number,
    @Query('filter') filter?: PostFilter,
    @Query('category') category?: PostCategory,
    @Query('sort') sort?: PostSort,
    @Query('reverse') reverse?: boolean,
    @Query('search') search?: string
  ): Promise<{ posts: PostI[], count: number }> {
    const params = { filter, category, sort, reverse, search }
    return this.postsService.findAll(userId, page, params);

  }

  @Get(':id')
  @ApiBearerAuth()
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @User() userId: number): Promise<PostEntity> {
    return this.postsService.findOne(id, userId);
  }

  @Delete(':id')
  @ApiBearerAuth()
  remove(
    @Param('id', ParseIntPipe) id: number,
    @User() userId: number): Promise<PostEntity> {
    return this.postsService.remove(id, userId);
  }
}
