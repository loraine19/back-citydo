import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../src/prisma/prisma.service';
import { ServicesController } from './service.controller';
import { ServicesService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { $Enums, Service } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { RequestWithUser } from '../auth/auth.entities/auth.entity';

describe('ServicesController', () => {
  let controller: ServicesController;
  let service: ServicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServicesController],
      providers: [
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mockToken'),
            verifyAsync: jest.fn().mockResolvedValue({ sub: 1 }),
          },
        },
        ServicesService,
        {
          provide: PrismaService,
          useValue: {
            service: {
              create: jest.fn(),
              findMany: jest.fn(),
              findAll: jest.fn(),
              findAllByUserId: jest.fn(),
              findOne: jest.fn(),
              remove: jest.fn(),
              findUniqueOrThrow: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    controller = module.get<ServicesController>(ServicesController);
    service = module.get<ServicesService>(ServicesService);
  });

  const serviceExampleDto: CreateServiceDto = { userId: 1, title: 'Test Service', description: 'Test Description', category: $Enums.ServiceCategory.CATEGORY_1, image: 'image', userIdResp: 1, type: $Enums.ServiceType.DO, skill: $Enums.SkillLevel.LEVEL_0, hard: $Enums.HardLevel.LEVEL_0, status: $Enums.ServiceStep.STEP_0 };
  const serviceExample: Service = { id: 1, createdAt: new Date(), updatedAt: new Date(), ...serviceExampleDto };

  it('should create a service', async () => {
    jest.spyOn(service, 'create').mockResolvedValue(serviceExample);
    const req = { user: { sub: 1 } } as RequestWithUser;
    expect(await controller.create(serviceExampleDto, null, req)).toEqual(serviceExample);
  });
  it('should update a service', async () => {
    const updateServiceDto: UpdateServiceDto = { ...serviceExampleDto };
    jest.spyOn(service, 'update').mockResolvedValue(serviceExample);
    expect(await controller.update(1, updateServiceDto, null)).toEqual(serviceExample);
  });

  it('should return all services', async () => {
    const services: Service[] = [serviceExample];
    jest.spyOn(service, 'findAll').mockResolvedValue(services);
    expect(await controller.findAll()).toEqual(services);
  });

  it('should return all my services', async () => {
    const services: Service[] = [serviceExample];
    jest.spyOn(service, 'findAllByUserId').mockResolvedValue(services);
    const req = { user: { sub: 1 } } as RequestWithUser;
    expect(await controller.findMines(req)).toEqual(services);
  });

  it('should return all services by user', async () => {
    const services: Service[] = [serviceExample];
    jest.spyOn(service, 'findAllByUserId').mockResolvedValue(services);
    expect(await controller.findAllByUserId(1)).toEqual(services);
  });

  it('should return a single service', async () => {
    jest.spyOn(service, 'findOne').mockResolvedValue(serviceExample);
    expect(await controller.findOne(1)).toEqual(serviceExample);
  });



  it('should delete a service', async () => {
    jest.spyOn(service, 'remove').mockResolvedValue(serviceExample);
    expect(await controller.remove(1)).toEqual(serviceExample);
  });
});
