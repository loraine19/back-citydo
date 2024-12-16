import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { LikesService } from './likes.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

import { UsersService } from 'src/users/users.service';
import { PostsService } from 'src/posts/posts.service';
import { LikeEntity } from './entities/like.entity';

const route = "likes"
@Controller(route)
@ApiTags(route)
export class LikesController {
  constructor(private readonly likesService: LikesService, private usersService: UsersService, private postService: PostsService) { }

  @Post()
  @ApiResponse({ type: LikeEntity })
  /// FK user & event 
  async create(@Body() data: CreateLikeDto) {
    const like = { userId: data.userId, postId: data.postId }
    return this.likesService.create(like)
  }

  @Get()
  @ApiResponse({ type: LikeEntity, isArray: true })
  async findAll() {
    const likes = await this.likesService.findAll()
    if (!likes.length) throw new HttpException(`no ${route} found`, HttpStatus.NO_CONTENT);
    return likes
  }

  @Get('user:userId&post:postId')
  @ApiResponse({ type: LikeEntity })
  async findOne(@Param('userId', ParseIntPipe) userId: number, @Param('postId', ParseIntPipe) postId: number) {
    return await this.likesService.findOne(userId, postId)
  }

  @Patch('user:userId&post:postId')
  @ApiResponse({ type: LikeEntity })
  async update(@Param('userId', ParseIntPipe) userId: number, @Param('postId', ParseIntPipe) postId: number, @Body() data: UpdateLikeDto) {
    const like = this.likesService.update(+userId, +postId, data);
    return like
  }

  @Delete('user:userId&post:postId')
  @ApiResponse({ type: LikeEntity })
  remove(@Param('userId', ParseIntPipe) userId: number, @Param('postId', ParseIntPipe) postId: number) {
    const like = this.likesService.remove(+userId, +postId);
    return like
  }
}
