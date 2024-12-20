import { Test, TestingModule } from '@nestjs/testing';
import { AddressService } from './address.service';

describe('AddressService', () => {
  let service: AddressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AddressService],
    }).compile();

    service = module.get<AddressService>(AddressService);
  });

  it('should return a list of addresses', async () => {
    const addresses = await service.findAll();
    expect(addresses).toEqual([]); // Adjust the expected result
  });
});