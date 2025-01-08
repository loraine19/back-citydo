import { Test, TestingModule } from '@nestjs/testing';
import { AddressController } from './address.controller';
import { AddressService } from './address.service';
import { AddressEntity } from './entities/address.entity';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Decimal } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { Address } from '@prisma/client';
import { RequestWithUser } from 'src/auth/auth.entities/auth.entity';

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
            findOneByUserId: jest.fn().mockResolvedValue(new AddressEntity()),
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
  const addressExample: Address = { id: 1, createdAt: new Date(), updatedAt: new Date(), address: addressExampleDto.address, city: addressExampleDto.city, zipcode: addressExampleDto.zipcode, lat: new Decimal(addressExampleDto.lat), lng: new Decimal(addressExampleDto.lng) };


  it('should create an event', async () => {
    jest.spyOn(service, 'create').mockResolvedValue(addressExample);
    expect(await controller.create(addressExampleDto)).toEqual(addressExample);
  });


  it('should return all addresses', async () => {
    jest.spyOn(service, 'findAll').mockResolvedValue([addressExample]);
    expect(await controller.findAll()).toEqual([addressExample]);
  });

  it('should return a single event', async () => {
    jest.spyOn(service, 'findOne').mockResolvedValue(addressExample);
    expect(await controller.findOne(1)).toEqual(addressExample);
  });


  it('should return one address by user', async () => {
    const address: Address = addressExample;
    const req = { user: { sub: 1 } } as RequestWithUser;
    jest.spyOn(service, 'findOneByUserId').mockResolvedValue(address);
    expect(await controller.findByUserId(req.user.sub)).toEqual(address);
  });

  it('should update an address', async () => {
    const updateAddressDto: UpdateAddressDto = { ...addressExampleDto };
    jest.spyOn(service, 'update').mockResolvedValue(addressExample);
    expect(await controller.update(1, updateAddressDto)).toEqual(addressExample);
  });

  it('should delete an address', async () => {
    jest.spyOn(service, 'remove').mockResolvedValue(addressExample);
    expect(await controller.remove(1)).toEqual(addressExample);
  });
});