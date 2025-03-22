import { Test, TestingModule } from '@nestjs/testing';
import { NotifsGateway } from './notifs.gateway';

describe('NotifsGateway', () => {
  let gateway: NotifsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotifsGateway],
    }).compile();

    gateway = module.get<NotifsGateway>(NotifsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
