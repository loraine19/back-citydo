import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UploadedFile, UseInterceptors, HttpException, NotFoundException, UseGuards, Req, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiOkResponse, ApiBody, ApiConsumes, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { parseData } from '../../middleware/BodyParser';
import { ImageInterceptor } from '../../middleware/ImageInterceptor';
import { PostEntity } from './entities/post.entity';
import { AuthGuard } from '../auth/auth.guard';
import { RequestWithUser } from 'src/auth/auth.entities/auth.entity';
import { User } from 'middleware/decorators';
import { PostFilter } from './entities/constant';
import { Post as PostI } from '@prisma/client'

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
  @UseInterceptors(ImageInterceptor.create('posts'))
  @ApiConsumes('multipart/form-data', 'application/json')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdatePostDto,
    @UploadedFile() image: Express.Multer.File,
    @User() userId: number): Promise<PostEntity> {
    data.userId = userId
    const post = await this.postsService.findOne(id, data.userId)
    post.image && image && ImageInterceptor.deleteImage(post.image)
    data = await parseData(data, image)
    return this.postsService.update(id, data)
  }

  @Get()
  @ApiBearerAuth()
  @ApiOkResponse({ type: PostEntity, isArray: true })
  async findAll(
    @User() userId: number,
    @Query('page', ParseIntPipe) page?: number,
    @Query('filter') filter?: string,
    @Query('category') category?: string): Promise<{ posts: PostI[], count: number }> {
    console.log(category, page)
    switch (filter) {
      case PostFilter.MINE:
        console.log('MINE')
        return this.postsService.findAllByUserId(userId, page, category);
      case PostFilter.ILIKE:
        console.log('ILIKE')
        return this.postsService.findAllILike(userId, page, category);
      default:
        console.log('ALL')
        return this.postsService.findAll(userId, page, category);
    }
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
