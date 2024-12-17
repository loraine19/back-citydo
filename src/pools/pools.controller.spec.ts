import { Test, TestingModule } from '@nestjs/testing';
import { PoolsController } from './pools.controller';
import { PoolsService } from './pools.service';

describe('PoolsController', () => {
  let controller: PoolsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PoolsController],
      providers: [PoolsService],
    }).compile();

    controller = module.get<PoolsController>(PoolsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
