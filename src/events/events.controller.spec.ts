import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../src/prisma/prisma.service';
import { EventsController } from '../events/events.controller';
import { EventsService } from '../events/events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { $Enums, Event } from '@prisma/client';

describe('EventsController', () => {
  let controller: EventsController;
  let service: EventsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
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

    controller = module.get<EventsController>(EventsController);
    service = module.get<EventsService>(EventsService);
  });

  const eventExampleDto: CreateEventDto = { title: 'Test Event', description: 'Test Content', category: $Enums.EventCategory.CATEGORY_1, userId: 1, image: 'image', addressId: 1, participantsMin: 1, start: new Date(), end: new Date() };
  const eventExample: Event = { id: 1, createdAt: new Date(), updatedAt: new Date(), ...eventExampleDto };

  it('should create an event', async () => {
    jest.spyOn(service, 'create').mockResolvedValue(eventExample);
    expect(await controller.create(eventExampleDto, null)).toEqual(eventExample);
  });

  it('should return all events', async () => {
    const events: Event[] = [eventExample];
    jest.spyOn(service, 'findAll').mockResolvedValue(events);
    expect(await controller.findAll()).toEqual(events);
  });

  it('should return a single event', async () => {
    const event: Event = eventExample;
    jest.spyOn(service, 'findOne').mockResolvedValue(event);
    expect(await controller.findOne(1)).toEqual(event);
  });

  it('should update an event', async () => {
    const updateEventDto: UpdateEventDto = { ...eventExampleDto };
    jest.spyOn(service, 'update').mockResolvedValue(eventExample);
    expect(await controller.update(1, updateEventDto, null)).toEqual(eventExample);
  });

  it('should delete an event', async () => {
    const event: Event = eventExample;
    jest.spyOn(service, 'remove').mockResolvedValue(event);
    expect(await controller.remove(1)).toEqual(event);
  });
});
