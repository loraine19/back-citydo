import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { $Enums, Post } from '@prisma/client';
import { PostEntity } from './entities/post.entity';

describe('PostsService', () => {
  let service: PostsService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
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

    service = module.get<PostsService>(PostsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });


  const postExampleDto: CreatePostDto = { title: 'Test Post', description: 'Test Content', category: $Enums.PostCategory.CATEGORY_1, userId: 1, image: 'image', share: $Enums.Share.PHONE, };
  const postExample: Post = { id: 1, createdAt: new Date(), updatedAt: new Date(), ...postExampleDto };


  it('should create a post', async () => {
    jest.spyOn(prismaService.post, 'create').mockResolvedValue(postExample);
    expect(await service.create(postExampleDto)).toEqual(postExample);
  });

  it('should return all posts', async () => {
    const posts: Post[] = [postExample];
    jest.spyOn(prismaService.post, 'findMany').mockResolvedValue(posts);
    expect(await service.findAll()).toEqual(posts);
  });

  it('should return a single post', async () => {
    const post: Post = postExample;
    jest.spyOn(prismaService.post, 'findUniqueOrThrow').mockResolvedValue(post);
    expect(await service.findOne(1)).toEqual(post);
  });

  it('should update a post', async () => {
    const updatePostDto: UpdatePostDto = { ...postExampleDto };
    jest.spyOn(prismaService.post, 'update').mockResolvedValue(postExample);
    expect(await service.update(1, updatePostDto)).toEqual(postExample);
  });

  it('should delete a post', async () => {
    const post: Post = postExample;
    jest.spyOn(prismaService.post, 'delete').mockResolvedValue(post);
    expect(await service.remove(1)).toEqual(post);
  });
});
