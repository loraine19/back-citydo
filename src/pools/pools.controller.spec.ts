import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../src/prisma/prisma.service';
import { PoolsController } from '../pools/pools.controller';
import { PoolsService } from '../pools/pools.service';
import { CreatePoolDto } from './dto/create-pool.dto';
import { UpdatePoolDto } from './dto/update-pool.dto';
import { $Enums, Pool } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { RequestWithUser } from '../auth/auth.entities/auth.entity';

describe('PoolsController', () => {
  let controller: PoolsController;
  let service: PoolsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PoolsController],
      providers: [
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mockToken'),
            verifyAsync: jest.fn().mockResolvedValue({ sub: 1 }),
          },
        },
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
          },
        },
      ],
    }).compile();

    controller = module.get<PoolsController>(PoolsController);
    service = module.get<PoolsService>(PoolsService);
  });

  const poolExampleDto: CreatePoolDto = { userId: 1, title: 'Test Pool', description: 'Test Description', userIdBenef: 3, };
  const poolExample: Pool = { id: 1, createdAt: new Date(), updatedAt: new Date(), ...poolExampleDto };

  it('should create a pool', async () => {
    jest.spyOn(service, 'create').mockResolvedValue(poolExample);
    expect(await controller.create(poolExampleDto)).toEqual(poolExample);
  });

  it('should return all pools', async () => {
    const pools: Pool[] = [poolExample];
    jest.spyOn(service, 'findAll').mockResolvedValue(pools);
    expect(await controller.findAll()).toEqual(pools);
  });

  it('should return all my pools', async () => {
    const pools: Pool[] = [poolExample];
    jest.spyOn(service, 'findAllByUserId').mockResolvedValue(pools);
    const req = { user: { sub: 1 } } as RequestWithUser;
    expect(await controller.findMines(req)).toEqual(pools);
  });

  it('should return all pools by user', async () => {
    const pools: Pool[] = [poolExample];
    jest.spyOn(service, 'findAllByUserId').mockResolvedValue(pools);
    expect(await controller.findAllByUserId(1)).toEqual(pools);
  });

  it('should return a single pool', async () => {
    const pool: Pool = poolExample;
    jest.spyOn(service, 'findOne').mockResolvedValue(pool);
    expect(await controller.findOne(1)).toEqual(pool);
  });

  it('should update a pool', async () => {
    const updatePoolDto: UpdatePoolDto = { ...poolExampleDto };
    jest.spyOn(service, 'update').mockResolvedValue(poolExample);
    expect(await controller.update(1, updatePoolDto)).toEqual(poolExample);
  });

  it('should delete a pool', async () => {
    const pool: Pool = poolExample;
    jest.spyOn(service, 'remove').mockResolvedValue(pool);
    expect(await controller.remove(1)).toEqual(pool);
  });
});
