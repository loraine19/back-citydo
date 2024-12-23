import { Test, TestingModule } from '@nestjs/testing';
import { ServicesService } from '../service/service.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { $Enums, Service } from '@prisma/client';
import { VotesService } from '../votes/votes.service';

describe('ServicesService', () => {
  let service: ServicesService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VotesService,
        ServicesService,
        {
          provide: PrismaService,
          useValue: {
            service: {
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

    service = module.get<ServicesService>(ServicesService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  const serviceExampleDto: CreateServiceDto = { userId: 1, title: 'Test Service', description: 'Test Description', category: $Enums.ServiceCategory.CATEGORY_1, image: 'image', userIdResp: 1, type: $Enums.ServiceType.DO, skill: $Enums.SkillLevel.LEVEL_0, hard: $Enums.HardLevel.LEVEL_0, status: $Enums.ServiceStep.STEP_0 };
  const serviceExample: Service = { id: 1, createdAt: new Date(), updatedAt: new Date(), ...serviceExampleDto };

  it('should create a service', async () => {
    jest.spyOn(prismaService.service, 'create').mockResolvedValue(serviceExample);
    expect(await service.create(serviceExampleDto)).toEqual(serviceExample);
  });

  it('should return all services', async () => {
    const services: Service[] = [serviceExample];
    jest.spyOn(prismaService.service, 'findMany').mockResolvedValue(services);
    expect(await service.findAll()).toEqual(services);
  });

  it('should return a single service', async () => {
    jest.spyOn(prismaService.service, 'findUniqueOrThrow').mockResolvedValue(serviceExample);
    expect(await service.findOne(1)).toEqual(serviceExample);
  });

  it('should update a service', async () => {
    const updateServiceDto: UpdateServiceDto = { ...serviceExampleDto };
    jest.spyOn(prismaService.service, 'update').mockResolvedValue(serviceExample);
    expect(await service.update(1, updateServiceDto)).toEqual(serviceExample);
  });

  it('should delete a service', async () => {
    jest.spyOn(prismaService.service, 'delete').mockResolvedValue(serviceExample);
    expect(await service.remove(1)).toEqual(serviceExample);
  });
});
