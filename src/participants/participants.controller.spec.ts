import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../src/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { ParticipantsController } from './participants.controller';
import { ParticipantsService } from './participants.service';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import { EventsService } from '../events/events.service';
import { Participant } from '@prisma/client';
import { UsersService } from '../users/users.service';


describe('ParticipantsController', () => {
  let controller: ParticipantsController;
  let service: ParticipantsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({})],
      controllers: [ParticipantsController],
      providers: [
        ParticipantsService,
        EventsService,
        UsersService,
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

    controller = module.get<ParticipantsController>(ParticipantsController);
    service = module.get<ParticipantsService>(ParticipantsService);
  });

  const participantExampleDto: CreateParticipantDto = { userId: 1, eventId: 1 };
  const participantExample: Participant = { createdAt: new Date(), updatedAt: new Date(), ...participantExampleDto };

  it('should create a participant ', async () => {
    jest.spyOn(service, 'create').mockResolvedValue(participantExample);
    const created = await controller.create(participantExampleDto);
    expect(created).toEqual(participantExample);
  });


  it('should return a single participant', async () => {
    jest.spyOn(service, 'findOne').mockResolvedValue(participantExample);
    expect(await controller.findOne(1, 1)).toEqual(participantExample);
  });


  it('should update a participant', async () => {
    const updateGroupUserDto: UpdateParticipantDto = { ...participantExampleDto };
    jest.spyOn(service, 'update').mockResolvedValue(participantExample);
    expect(await controller.update(1, 1, updateGroupUserDto)).toEqual(participantExample);
  });

  it('should delete a participant', async () => {
    jest.spyOn(service, 'remove').mockResolvedValue(participantExample);
    expect(await controller.remove(1, 1)).toEqual(participantExample);
  });
});