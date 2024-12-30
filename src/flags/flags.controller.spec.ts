import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../src/prisma/prisma.service';
import { FlagsController } from '../flags/flags.controller';
import { FlagsService } from '../flags/flags.service';
import { CreateFlagDto } from './dto/create-flag.dto';
import { UpdateFlagDto } from './dto/update-flag.dto';
import { $Enums, Flag } from '@prisma/client';
import { JwtModule } from '@nestjs/jwt';
import { PostsService } from '../posts/posts.service';
import { UsersService } from '../users/users.service';

describe('FlagsController', () => {
  let controller: FlagsController;
  let service: FlagsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({})],
      controllers: [FlagsController],
      providers: [
        FlagsService,
        PostsService,
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            flag: {
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

    controller = module.get<FlagsController>(FlagsController);
    service = module.get<FlagsService>(FlagsService);
  });

  const flagExampleDto: CreateFlagDto = { userId: 1, targetId: 1, target: $Enums.FlagTarget.POST, reason: $Enums.FlagReason.REASON_1 };
  const flagExample: Flag = { createdAt: new Date(), updatedAt: new Date(), ...flagExampleDto };

  it('should create a flag', async () => {
    jest.spyOn(service, 'create').mockResolvedValue(flagExample);
    const created = await controller.create(flagExampleDto);
    expect(created).toEqual(flagExample);
  });

  it('should return all flags', async () => {
    const flags: Flag[] = [flagExample];
    jest.spyOn(service, 'findAll').mockResolvedValue(flags);
    expect(await controller.findAll()).toEqual(flags);
  });

  it('should return all flags by userId', async () => {
    const flags: Flag[] = [flagExample];
    jest.spyOn(service, 'findAllByUserId').mockResolvedValue(flags);
    expect(await controller.findAllByUserId(1)).toEqual(flags);
  });

  it('should return a single flag', async () => {
    const flag: Flag = flagExample;
    jest.spyOn(service, 'findOne').mockResolvedValue(flag);
    expect(await controller.findOne(1, 1, $Enums.FlagTarget.POST)).toEqual(flag);
  });

  it('should update a flag', async () => {
    const updateFlagDto: UpdateFlagDto = { ...flagExampleDto };
    jest.spyOn(service, 'update').mockResolvedValue(flagExample);
    expect(await controller.update(1, 1, $Enums.FlagTarget.POST, updateFlagDto)).toEqual(flagExample);
  });

  it('should delete a flag', async () => {
    const flag: Flag = flagExample;
    jest.spyOn(service, 'remove').mockResolvedValue(flag);
    expect(await controller.remove(1, 1, $Enums.FlagTarget.POST)).toEqual(flag);
  });
});
