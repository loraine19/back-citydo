import { Test, TestingModule } from '@nestjs/testing';
import { PoolsService } from './pools.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { CreatePoolDto } from './dto/create-pool.dto';
import { UpdatePoolDto } from './dto/update-pool.dto';
import { Pool } from '@prisma/client';
import { VotesService } from '../votes/votes.service';

describe('PoolsService', () => {
  let service: PoolsService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VotesService,
        PoolsService,
        {
          provide: PrismaService,
          useValue: {
            pool: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUniqueOrThrow: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            vote: {
              findMany: jest.fn(),
            }
          },
        },
      ],
    }).compile();

    service = module.get<PoolsService>(PoolsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  const poolExampleDto: CreatePoolDto = { userId: 1, title: 'Test Pool', description: 'Test Description', userIdBenef: 3, };
  const poolExample: Pool = { id: 1, createdAt: new Date(), updatedAt: new Date(), ...poolExampleDto };

  it('should create a pool', async () => {
    jest.spyOn(prismaService.pool, 'create').mockResolvedValue(poolExample);
    expect(await service.create(poolExampleDto)).toEqual(poolExample);
  });

  it('should return all pools', async () => {
    const pools: Pool[] = [poolExample];
    jest.spyOn(prismaService.pool, 'findMany').mockResolvedValue(pools);
    expect(await service.findAll()).toEqual(pools);
  });

  it('should return a single pool', async () => {
    const pool: Pool = poolExample;
    jest.spyOn(prismaService.pool, 'findUniqueOrThrow').mockResolvedValue(pool);
    expect(await service.findOne(1)).toEqual(pool);
  });

  it('should update a pool', async () => {
    const updatePoolDto: UpdatePoolDto = { ...poolExampleDto };
    jest.spyOn(prismaService.pool, 'update').mockResolvedValue(poolExample);
    expect(await service.update(1, updatePoolDto)).toEqual(poolExample);
  });

  it('should delete a pool', async () => {
    const pool: Pool = poolExample;
    jest.spyOn(prismaService.pool, 'delete').mockResolvedValue(pool);
    expect(await service.remove(1)).toEqual(pool);
  });
});
