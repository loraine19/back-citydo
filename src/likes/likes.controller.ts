import { Controller, Post, Body, Param, Delete, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { LikesService } from './likes.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LikeEntity } from './entities/like.entity';
import { AuthGuard } from '../auth/auth.guard';
import { Like } from '@prisma/client';
import { RequestWithUser } from 'src/auth/auth.entities/auth.entity';

const route = "likes"
@UseGuards(AuthGuard)
@Controller(route)
@ApiTags(route)

export class LikesController {
  constructor(private readonly likesService: LikesService) { }

  @Post()
  @ApiBearerAuth()
  @ApiResponse({ type: LikeEntity })
  async create(@Body() data: CreateLikeDto, @Req() req: RequestWithUser): Promise<Like> {
    const userId = req.user.sub
    const like = { userId, postId: data.postId }
    return this.likesService.create(like)
  }


  @Delete('post:postId')
  @ApiBearerAuth()
  @ApiResponse({ type: LikeEntity })
  async removeByUser(@Param('postId', ParseIntPipe) postId: number, @Req() req: RequestWithUser): Promise<Like> {
    const userId = req.user.sub
    return this.likesService.remove(userId, postId);
  }
}
