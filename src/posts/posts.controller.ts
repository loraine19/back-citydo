import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UploadedFile, UseInterceptors, HttpException, NotFoundException } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiOkResponse, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { parseData } from '../../middleware/BodyParser';
import { ImageInterceptor } from '../../middleware/ImageInterceptor';
import { PostEntity } from './entities/post.entity';

const route = 'posts'
ApiTags(route)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @Post()
  @ApiOkResponse({ type: PostEntity })
  @ApiBody({ type: CreatePostDto })
  @UseInterceptors(ImageInterceptor.create('posts'))
  @ApiConsumes('multipart/form-data', 'application/json')
  async create(@Body() data: CreatePostDto, @UploadedFile() image: Express.Multer.File,): Promise<CreatePostDto> {
    data = await parseData(data, image)
    return this.postsService.create(data)
  }

  @Patch(':id')
  @ApiOkResponse({ type: PostEntity })
  @ApiBody({ type: UpdatePostDto })
  @UseInterceptors(ImageInterceptor.create('posts'))
  @ApiConsumes('multipart/form-data', 'application/json')
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdatePostDto, @UploadedFile() image: Express.Multer.File): Promise<UpdatePostDto> {
    data = await parseData(data, image)
    return this.postsService.update(id, data)
  }

  @Get()
  @ApiOkResponse({ type: PostEntity, isArray: true })
  async findAll() {
    const posts = await this.postsService.findAll()
    if (posts.length === 0) throw new NotFoundException(`no one ${route} find`)
    return posts
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.remove(id);
  }
}
