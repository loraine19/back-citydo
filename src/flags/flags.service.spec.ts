import { Test, TestingModule } from '@nestjs/testing';
import { FlagsService } from '../flags/flags.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { CreateFlagDto } from './dto/create-flag.dto';
import { UpdateFlagDto } from './dto/update-flag.dto';
import { $Enums, Flag } from '@prisma/client';
import { RequestWithUser } from 'src/auth/auth.entities/auth.entity';

describe('FlagsService', () => {
  let service: FlagsService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FlagsService,
        {
          provide: PrismaService,
          useValue: {
            flag: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              findUniqueOrThrow: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<FlagsService>(FlagsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  const flagExampleDto: CreateFlagDto = { userId: 1, targetId: 1, target: $Enums.FlagTarget.POST, reason: $Enums.FlagReason.REASON_1 };
  const flagExample: Flag = { createdAt: new Date(), updatedAt: new Date(), ...flagExampleDto };

  it('should create a flag', async () => {
    jest.spyOn(prismaService.flag, 'create').mockResolvedValue(flagExample);
    expect(await service.create(flagExampleDto)).toEqual(flagExample);
  });

  it('should return all flags ', async () => {
    const flags: Flag[] = [flagExample];
    jest.spyOn(prismaService.flag, 'findMany').mockResolvedValue(flags);
    expect(await service.findAll()).toEqual(flags);
  });

  it('should return all flags by user ', async () => {
    const flags: Flag[] = [flagExample];
    jest.spyOn(prismaService.flag, 'findMany').mockResolvedValue(flags);
    expect(await service.findAllByUserId(1)).toEqual(flags);
  });

  it('should return a single flag', async () => {
    jest.spyOn(prismaService.flag, 'findUniqueOrThrow').mockResolvedValue(flagExample);
    expect(await service.findOne(1, 1, $Enums.FlagTarget.POST)).toEqual(flagExample)
  });

  it('should update a flag', async () => {
    const updateFlagDto: UpdateFlagDto = { ...flagExampleDto };
    jest.spyOn(prismaService.flag, 'update').mockResolvedValue(flagExample);
    expect(await service.update(1, 1, $Enums.FlagTarget.POST, updateFlagDto)).toEqual(flagExample);
  });

  it('should delete a flag', async () => {
    const flag: Flag = flagExample;
    jest.spyOn(prismaService.flag, 'delete').mockResolvedValue(flagExample);
    expect(await service.remove(1, 1, $Enums.FlagTarget.POST)).toEqual(flagExample);
  });
});
