import { Test, TestingModule } from '@nestjs/testing';
import { PoolsSurveysService } from './pools-surveys.service';

describe('PoolsSurveysService', () => {
  let service: PoolsSurveysService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PoolsSurveysService],
    }).compile();

    service = module.get<PoolsSurveysService>(PoolsSurveysService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
