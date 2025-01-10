import { Test, TestingModule } from '@nestjs/testing';
import { PoolsSurveysController } from './pools-surveys.controller';
import { PoolsSurveysService } from './pools-surveys.service';

describe('PoolsSurveysController', () => {
  let controller: PoolsSurveysController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PoolsSurveysController],
      providers: [PoolsSurveysService],
    }).compile();

    controller = module.get<PoolsSurveysController>(PoolsSurveysController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
