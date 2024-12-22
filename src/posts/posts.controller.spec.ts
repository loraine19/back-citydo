import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { $Enums, Post } from '@prisma/client';
import { JwtModule, JwtService } from '@nestjs/jwt';

describe('PostsController', () => {
  let controller: PostsController;
  let service: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mockToken'),
            verifyAsync: jest.fn().mockResolvedValue({ sub: 1 }),
          },
        },
        PostsService,
        {
          provide: PrismaService,
          useValue: {
            post: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUniqueOrThrow: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    controller = module.get<PostsController>(PostsController);
    service = module.get<PostsService>(PostsService);
  });

  const postExampleDto: CreatePostDto = { title: 'Test Post', description: 'Test Content', category: $Enums.PostCategory.CATEGORY_1, userId: 1, image: 'image', share: $Enums.Share.PHONE };
  const postExample: Post = { id: 1, createdAt: new Date(), updatedAt: new Date(), ...postExampleDto };

  it('should create a post', async () => {
    jest.spyOn(service, 'create').mockResolvedValue(postExample);
    expect(await controller.create(postExampleDto, null)).toEqual(postExample);
  });

  it('should return all posts', async () => {
    const posts: Post[] = [postExample];
    jest.spyOn(service, 'findAll').mockResolvedValue(posts);
    expect(await controller.findAll()).toEqual(posts);
  });

  it('should return a single post', async () => {
    const post: Post = postExample;
    jest.spyOn(service, 'findOne').mockResolvedValue(post);
    expect(await controller.findOne(1)).toEqual(post);
  });

  it('should update a post', async () => {
    const updatePostDto: UpdatePostDto = { ...postExampleDto };
    jest.spyOn(service, 'update').mockResolvedValue(postExample);
    expect(await controller.update(1, updatePostDto, null)).toEqual(postExample);
  });

  it('should delete a post', async () => {
    const post: Post = postExample;
    jest.spyOn(service, 'remove').mockResolvedValue(post);
    expect(await controller.remove(1)).toEqual(post);
  });
});
