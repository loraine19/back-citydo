import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { UsersService } from 'src/users/users.service';
import { PostsService } from 'src/posts/posts.service';

@Module({
  controllers: [LikesController],
  providers: [LikesService, UsersService, PostsService],
})
export class LikesModule { }
