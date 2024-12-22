import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../src/prisma/prisma.service';
import { LikesController } from '../likes/likes.controller';
import { LikesService } from '../likes/likes.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
import { Like } from '@prisma/client';
import { JwtModule } from '@nestjs/jwt';
import { PostsService } from '../posts/posts.service';
import { UsersService } from '../users/users.service';

describe('LikesController', () => {
  let controller: LikesController;
  let service: LikesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({})],
      controllers: [LikesController],
      providers: [
        LikesService,
        PostsService,
        UsersService,
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

    controller = module.get<LikesController>(LikesController);
    service = module.get<LikesService>(LikesService);
  });

  const likeExampleDto: CreateLikeDto = { userId: 1, postId: 1 };
  const likeExample: Like = { updatedAt: new Date(), ...likeExampleDto };

  it('should create a like', async () => {
    jest.spyOn(service, 'create').mockResolvedValue(likeExample);
    const created = await controller.create(likeExampleDto);
    expect(created).toEqual(likeExample);
  });

  it('should return all likes', async () => {
    const likes: Like[] = [likeExample];
    jest.spyOn(service, 'findAll').mockResolvedValue(likes);
    expect(await controller.findAll()).toEqual(likes);
  });

  it('should return all likes by userId', async () => {
    const likes: Like[] = [likeExample];
    jest.spyOn(service, 'findAllByUserId').mockResolvedValue(likes);
    expect(await controller.findAllByUserId(1)).toEqual(likes);
  });

  it('should return a single like', async () => {
    const like: Like = likeExample;
    jest.spyOn(service, 'findOne').mockResolvedValue(like);
    expect(await controller.findOne(1, 1)).toEqual(like);
  });

  it('should update a like', async () => {
    const updateLikeDto: UpdateLikeDto = { ...likeExampleDto };
    jest.spyOn(service, 'update').mockResolvedValue(likeExample);
    expect(await controller.update(1, 1, updateLikeDto)).toEqual(likeExample);
  });

  it('should delete a like', async () => {
    const like: Like = likeExample;
    jest.spyOn(service, 'remove').mockResolvedValue(like);
    expect(await controller.remove(1, 1)).toEqual(like);
  });
});
