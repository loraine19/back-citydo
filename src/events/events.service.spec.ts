import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { $Enums, Event } from '@prisma/client';

describe('EventsService', () => {
  let service: EventsService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: PrismaService,
          useValue: {
            event: {
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

    service = module.get<EventsService>(EventsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  const eventExampleDto: CreateEventDto = { title: 'Test Event', description: 'Test Content', category: $Enums.EventCategory.CATEGORY_1, userId: 1, image: 'image', addressId: 1, participantsMin: 1, start: new Date(), end: new Date() };
  const eventExample: Event = { id: 1, createdAt: new Date(), updatedAt: new Date(), ...eventExampleDto };

  it('should create an event', async () => {
    jest.spyOn(prismaService.event, 'create').mockResolvedValue(eventExample);
    expect(await service.create(eventExampleDto)).toEqual(eventExample);
  });

  it('should return all events', async () => {
    const events: Event[] = [eventExample];
    jest.spyOn(prismaService.event, 'findMany').mockResolvedValue(events);
    expect(await service.findAll()).toEqual(events);
  });

  it('should return a single event', async () => {
    const event: Event = eventExample;
    jest.spyOn(prismaService.event, 'findUniqueOrThrow').mockResolvedValue(event);
    expect(await service.findOne(1)).toEqual(event);
  });

  it('should update an event', async () => {
    const updateEventDto: UpdateEventDto = { ...eventExampleDto };
    jest.spyOn(prismaService.event, 'update').mockResolvedValue(eventExample);
    expect(await service.update(1, updateEventDto)).toEqual(eventExample);
  });

  it('should delete an event', async () => {
    const event: Event = eventExample;
    jest.spyOn(prismaService.event, 'delete').mockResolvedValue(event);
    expect(await service.remove(1)).toEqual(event);
  });
});
