import { Test, TestingModule } from '@nestjs/testing';
import { AddressController } from './address.controller';
import { AddressService } from './address.service';
import { AddressEntity } from './entities/address.entity';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Decimal } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { Address } from '@prisma/client';

describe('AddressController', () => {
  let controller: AddressController;
  let service: AddressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddressController],
      providers: [
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mockToken'),
            verifyAsync: jest.fn().mockResolvedValue({ sub: 1 }),
          },
        },
        {
          provide: AddressService,
          useValue: {
            create: jest.fn().mockResolvedValue(new AddressEntity()),
            findAll: jest.fn().mockResolvedValue([new AddressEntity()]),
            findOne: jest.fn().mockResolvedValue(new AddressEntity()),
            findOneUsers: jest.fn().mockResolvedValue(new AddressEntity()),
            update: jest.fn().mockResolvedValue(new AddressEntity()),
            remove: jest.fn().mockResolvedValue(new AddressEntity()),
          },
        },
      ],
    }).compile();

    controller = module.get<AddressController>(AddressController);
    service = module.get<AddressService>(AddressService);
  });

  const addressExampleDto: CreateAddressDto = { address: 'Test Address', city: 'Test City', zipcode: '13000', lat: new Decimal(0), lng: new Decimal(0) };
  const addressExample: Address = { id: 1, createdAt: new Date(), updatedAt: new Date(), ...addressExampleDto };


  it('should create an address', async () => {
    const result = await controller.create(addressExampleDto);
    expect(result).toBeInstanceOf(AddressEntity);
    expect(service.create).toHaveBeenCalledWith(addressExampleDto);;
  });

  it('should return an array of addresses', async () => {
    const addresses = await controller.findAll();
    expect(addresses).toBeInstanceOf(Array);
    expect(addresses.length).toBeGreaterThanOrEqual(1);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return a single address', async () => {
    const id = 1;
    const address = await controller.findOne(id);
    expect(address).toBeInstanceOf(AddressEntity);
    expect(service.findOne).toHaveBeenCalledWith(id);
  });

  it('should return a single address with users', async () => {
    const id = 1;
    const address = await controller.findOneUsers(id);
    expect(address).toBeInstanceOf(AddressEntity);
    expect(service.findOneUsers).toHaveBeenCalledWith(id);
  });

  it('should update an address', async () => {
    const id = 1;
    const updateAddressDto: UpdateAddressDto = { ...addressExampleDto };
    const result = await controller.update(id, updateAddressDto);
    expect(result).toBeInstanceOf(AddressEntity);
    expect(service.update).toHaveBeenCalledWith(id, updateAddressDto);
  });

  it('should delete an address', async () => {
    const id = 1;
    const result = await controller.remove(id);
    expect(result).toHaveProperty('message', 'address 1 deleted');
    expect(service.remove).toHaveBeenCalledWith(id);
  });


});