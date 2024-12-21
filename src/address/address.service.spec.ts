import { Test, TestingModule } from '@nestjs/testing';
import { AddressService } from '../address/address.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

describe('AddressService', () => {
  let service: AddressService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddressService,
        {
          provide: PrismaService,
          useValue: {
            address: {
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

    service = module.get<AddressService>(AddressService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  const addressExampleDto: CreateAddressDto = { address: 'Test Address', city: 'Test City', zipcode: '13000', lat: new Decimal(0), lng: new Decimal(0) };
  const addressExample: Address = { id: 1, createdAt: new Date(), updatedAt: new Date(), ...addressExampleDto };

  it('should create an address', async () => {
    jest.spyOn(prismaService.address, 'create').mockResolvedValue(addressExample);
    expect(await service.create(addressExampleDto)).toEqual(addressExample);
  });

  it('should return all addresses', async () => {
    const addresses: Address[] = [addressExample];
    jest.spyOn(prismaService.address, 'findMany').mockResolvedValue(addresses);
    expect(await service.findAll()).toEqual(addresses);
  });

  it('should return a single address', async () => {
    const address: Address = addressExample;
    jest.spyOn(prismaService.address, 'findUniqueOrThrow').mockResolvedValue(address);
    expect(await service.findOne(1)).toEqual(address);
  });

  it('should update an address', async () => {
    const updateAddressDto: UpdateAddressDto = { ...addressExampleDto };
    jest.spyOn(prismaService.address, 'update').mockResolvedValue(addressExample);
    expect(await service.update(1, updateAddressDto)).toEqual(addressExample);
  });

  it('should delete an address', async () => {
    const address: Address = addressExample;
    jest.spyOn(prismaService.address, 'delete').mockResolvedValue(address);
    expect(await service.remove(1)).toEqual(address);
  });
});
