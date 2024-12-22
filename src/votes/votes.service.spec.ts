import { Test, TestingModule } from '@nestjs/testing';
import { VotesController } from './votes.controller';
import { VotesService } from './votes.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { $Enums, Vote } from '@prisma/client';
import { UsersService } from '../users/users.service';
import { JwtModule } from '@nestjs/jwt';

describe('VotesController', () => {
  let controller: VotesController;
  let service: VotesService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({})],
      controllers: [VotesController],
      providers: [
        VotesService,
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
    prismaService = module.get<PrismaService>(PrismaService);
  });

  const voteExampleDto: CreateVoteDto = { userId: 1, targetId: 1, target: $Enums.VoteTarget.POOL, opinion: $Enums.VoteOpinion.OK };
  const voteExample: Vote = { createdAt: new Date(), updatedAt: new Date(), ...voteExampleDto };

  it('should create a vote', async () => {
    jest.spyOn(service, 'create').mockResolvedValue(voteExample);
    expect(await controller.create(voteExampleDto)).toEqual(voteExample);
  });

  it('should return all votes', async () => {
    const votes: Vote[] = [voteExample];
    jest.spyOn(service, 'findAll').mockResolvedValue(votes);
    expect(await controller.findAll()).toEqual(votes);
  });


  it('should return all votes by user', async () => {
    const votes: Vote[] = [voteExample];
    jest.spyOn(service, 'findAllByUserId').mockResolvedValue(votes);
    expect(await controller.findAllByUserId(1)).toEqual(votes);
  });

  it('should return all pool votes by user', async () => {
    const votes: Vote[] = [voteExample];
    jest.spyOn(service, 'findAllPoolByUserId').mockResolvedValueOnce(votes);
    expect(await controller.findAllPoolByUserId(1)).toEqual(votes);
  });

  it('should return all survey votes by user', async () => {
    const votes: Vote[] = [voteExample];
    jest.spyOn(service, 'findAllSurveyByUserId').mockResolvedValue(votes);
    expect(await controller.findAllSurveyByUserId(1)).toEqual(votes);
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
