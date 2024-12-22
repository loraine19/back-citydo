import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../src/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { VotesController } from './votes.controller';
import { VotesService } from './votes.service';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { EventsService } from '../events/events.service';
import { $Enums, Vote } from '@prisma/client';
import { UsersService } from '../users/users.service';

describe('VotesController', () => {
  let controller: VotesController;
  let service: VotesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({})],
      controllers: [VotesController],
      providers: [
        VotesService,
        EventsService,
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            vote: {
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

    controller = module.get<VotesController>(VotesController);
    service = module.get<VotesService>(VotesService);
  });

  const voteExampleDto: CreateVoteDto = { userId: 1, targetId: 1, target: 'POOL', opinion: 'OK' };
  const voteExample: Vote = { createdAt: new Date(), updatedAt: new Date(), ...voteExampleDto };

  it('should create a vote', async () => {
    jest.spyOn(service, 'create').mockResolvedValue(voteExample);
    const created = await controller.create(voteExampleDto);
    expect(created).toEqual(voteExample);
  });

  it('should return a single vote', async () => {
    jest.spyOn(service, 'findOne').mockResolvedValue(voteExample);
    expect(await controller.findOne(1, 1, $Enums.VoteTarget.POOL)).toEqual(voteExample);
  });

  it('should update a vote', async () => {
    const updateVoteDto: UpdateVoteDto = { ...voteExampleDto };
    jest.spyOn(service, 'update').mockResolvedValue(voteExample);
    expect(await controller.update(1, 1, $Enums.VoteTarget.POOL, updateVoteDto)).toEqual(voteExample);
  });

  it('should delete a vote', async () => {
    jest.spyOn(service, 'remove').mockResolvedValue(voteExample);
    expect(await controller.remove(1, 1, $Enums.VoteTarget.POOL)).toEqual(voteExample);
  });
});
