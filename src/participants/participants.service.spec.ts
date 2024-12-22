import { Test, TestingModule } from '@nestjs/testing';
import { ParticipantsService } from './participants.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import { Participant } from '@prisma/client';

describe('ParticipantsService', () => {
  let service: ParticipantsService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ParticipantsService,
        {
          provide: PrismaService,
          useValue: {
            participant: {
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

    service = module.get<ParticipantsService>(ParticipantsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  const participantExampleDto: CreateParticipantDto = { userId: 1, eventId: 1, };
  const participantExample: Participant = { createdAt: new Date(), updatedAt: new Date(), ...participantExampleDto };

  it('should create a participant', async () => {
    jest.spyOn(prismaService.participant, 'create').mockResolvedValue(participantExample);
    expect(await service.create(participantExampleDto)).toEqual(participantExample);
  });

  it('should return all participants', async () => {
    const participants: Participant[] = [participantExample];
    jest.spyOn(prismaService.participant, 'findMany').mockResolvedValue(participants);
    expect(await service.findAll()).toEqual(participants);
  });

  it('should return a single participant', async () => {
    jest.spyOn(prismaService.participant, 'findUniqueOrThrow').mockResolvedValue(participantExample);
    expect(await service.findOne(1, 1)).toEqual(participantExample);
  });

  it('should update a participant', async () => {
    const updateParticipantDto: UpdateParticipantDto = { ...participantExampleDto };
    jest.spyOn(prismaService.participant, 'update').mockResolvedValue(participantExample);
    expect(await service.update(1, 1, updateParticipantDto)).toEqual(participantExample);
  });

  it('should delete a participant', async () => {
    jest.spyOn(prismaService.participant, 'delete').mockResolvedValue(participantExample);
    expect(await service.remove(1, 1)).toEqual(participantExample);
  });
});
