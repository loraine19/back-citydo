import { Test, TestingModule } from '@nestjs/testing';
import { LikesService } from '../likes/likes.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
import { Like } from '@prisma/client';

describe('LikesService', () => {
  let service: LikesService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LikesService,
        {
          provide: PrismaService,
          useValue: {
            like: {
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

    service = module.get<LikesService>(LikesService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  const likeExampleDto: CreateLikeDto = { userId: 1, postId: 1 };
  const likeExample: Like = { updatedAt: new Date(), ...likeExampleDto };

  it('should create a like', async () => {
    jest.spyOn(prismaService.like, 'create').mockResolvedValue(likeExample);
    expect(await service.create(likeExampleDto)).toEqual(likeExample);
  });

  it('should return all likes ', async () => {
    const likes: Like[] = [likeExample];
    jest.spyOn(prismaService.like, 'findMany').mockResolvedValue(likes);
    expect(await service.findAll()).toEqual(likes);
  });

  it('should return all likes by user ', async () => {
    const likes: Like[] = [likeExample];
    jest.spyOn(prismaService.like, 'findMany').mockResolvedValue(likes);
    expect(await service.findAllByUserId(1)).toEqual(likes);
  });

  it('should return a single like', async () => {
    const like: Like = likeExample;
    jest.spyOn(prismaService.like, 'findUniqueOrThrow').mockResolvedValue(like);
    expect(await service.findOne(1, 1)).toEqual(like);
  });

  it('should update a like', async () => {
    const updateLikeDto: UpdateLikeDto = { ...likeExampleDto };
    jest.spyOn(prismaService.like, 'update').mockResolvedValue(likeExample);
    expect(await service.update(1, 1, updateLikeDto)).toEqual(likeExample);
  });

  it('should delete a like', async () => {
    const like: Like = likeExample;
    jest.spyOn(prismaService.like, 'delete').mockResolvedValue(like);
    expect(await service.remove(1, 1)).toEqual(like);
  });
});
