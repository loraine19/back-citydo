import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, ParseIntPipe, UseGuards } from '@nestjs/common';
import { LikesService } from './likes.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from '../users/users.service';
import { PostsService } from '../posts/posts.service';
import { LikeEntity } from './entities/like.entity';
import { AuthGuard } from '../auth/auth.guard';
import { Like } from '@prisma/client';

const route = "likes"
@UseGuards(AuthGuard)
@Controller(route)
@ApiTags(route)

export class LikesController {
  constructor(private readonly likesService: LikesService, private usersService: UsersService, private postService: PostsService) { }

  @Post()
  @ApiBearerAuth()
  @ApiResponse({ type: LikeEntity })
  async create(@Body() data: CreateLikeDto): Promise<Like> {
    const like = { userId: data.userId, postId: data.postId }
    return this.likesService.create(like)
  }

  @Get()
  @ApiBearerAuth()
  @ApiResponse({ type: LikeEntity, isArray: true })
  async findAll(): Promise<Like[]> {
    const likes = await this.likesService.findAll()
    if (!likes.length) throw new HttpException(`no ${route} found`, HttpStatus.NO_CONTENT);
    return likes
  }


  @Get('user/:userId')
  @ApiBearerAuth()
  @ApiResponse({ type: LikeEntity, isArray: true })
  async findAllByUserId(@Param('userId', ParseIntPipe) userId: number): Promise<Like[]> {
    return this.likesService.findAllByUserId(userId)
  }



  @Get('user:userId/post:postId')
  @ApiBearerAuth()
  @ApiResponse({ type: LikeEntity })
  async findOne(@Param('userId', ParseIntPipe) userId: number, @Param('postId', ParseIntPipe) postId: number): Promise<Like> {
    return await this.likesService.findOne(userId, postId)
  }



  @Patch('user:userId&post:postId')
  @ApiBearerAuth()
  @ApiResponse({ type: LikeEntity })
  async update(@Param('userId', ParseIntPipe) userId: number, @Param('postId', ParseIntPipe) postId: number, @Body() data: UpdateLikeDto): Promise<Like> {
    const like = this.likesService.update(+userId, +postId, data);
    return like
  }

  @Delete('user:userId&post:postId')
  @ApiBearerAuth()
  @ApiResponse({ type: LikeEntity })
  remove(@Param('userId', ParseIntPipe) userId: number, @Param('postId', ParseIntPipe) postId: number): Promise<Like> {
    const like = this.likesService.remove(+userId, +postId);
    return like
  }
}
