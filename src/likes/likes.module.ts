import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { UsersService } from '../users/users.service';
import { PostsService } from '../posts/posts.service';
import { ImageInterceptor } from 'middleware/ImageInterceptor';

@Module({
  controllers: [LikesController],
  providers: [LikesService, UsersService, PostsService, ImageInterceptor],
})
export class LikesModule { }
