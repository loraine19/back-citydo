import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PrismaModule } from '../../src/prisma/prisma.module';
import { ImageInterceptor } from 'middleware/ImageInterceptor';

@Module({
  imports: [PrismaModule],
  controllers: [PostsController],
  providers: [PostsService, ImageInterceptor],
})
export class PostsModule { }
