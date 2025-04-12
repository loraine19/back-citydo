import { Test, TestingModule } from '@nestjs/testing';
import { FlagsService } from './flags.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFlagDto } from './dto/create-flag.dto';
import { $Enums, Flag, Event, FlagTarget } from '@prisma/client';
import { HttpException, HttpStatus } from '@nestjs/common'
import { NotificationsService } from '../notifications/notifications.service';

const mockPrismaService = {
  flag: {
    // Mocking Prisma's flag model methods to simulate database interactions
    findUnique: jest.fn(),
    create: jest.fn(),
    count: jest.fn(),
    delete: jest.fn()
  },
  Event: {
    // Mocking Prisma's Event model methods for dynamic access
    findUnique: jest.fn(),
    delete: jest.fn()
  },
  Post: {
    // Mocking Prisma's Post model methods
    findUnique: jest.fn(),
    delete: jest.fn()
  },
  Service: {
    // Mocking Prisma's Service model methods
    findUnique: jest.fn(),
    delete: jest.fn()
  },
  Survey: {
    // Mocking Prisma's Survey model methods
    findUnique: jest.fn(),
    delete: jest.fn()
  },
  event: {
    // Lowercase keys for direct access in case the service uses lowercase model names
    findUnique: jest.fn(),
    delete: jest.fn()
  },
  post: { findUnique: jest.fn(), delete: jest.fn() },
  service: { findUnique: jest.fn(), delete: jest.fn() },
  survey: { findUnique: jest.fn(), delete: jest.fn() },
};

const mockNotificationsService = {
  // Mocking NotificationsService to simulate notification creation
  create: jest.fn(),
};

describe('FlagsService', () => {
  let service: FlagsService;
  let prisma: PrismaService;
  let notificationsService: NotificationsService;

  beforeEach(async () => {
    // Reset all mock calls and states before each test
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FlagsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: NotificationsService, useValue: mockNotificationsService },
      ],
    }).compile();

    service = module.get<FlagsService>(FlagsService);
    prisma = module.get<PrismaService>(PrismaService);
    notificationsService = module.get<NotificationsService>(NotificationsService);
  });

  it('should be defined', () => {
    // Basic test to ensure the service is properly instantiated
    expect(service).toBeDefined();
  });

  // --- Tests for the create method ---
  describe('create', () => {
    const userId = 1;
    const targetId = 15;

    const createFlagDto: CreateFlagDto = {
      userId: userId,
      targetId: targetId,
      target: $Enums.FlagTarget.EVENT,
      reason: $Enums.FlagReason.REASON_1,
    };

    const mockCreatedFlag: Flag = {
      userId: userId,
      target: $Enums.FlagTarget.EVENT,
      targetId: targetId,
      reason: $Enums.FlagReason.REASON_1,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const mockEvent: Event = {
      // Mocking an Event object to simulate a valid target
      id: targetId,
      title: 'Test Event',
      description: '',
      userId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
      start: new Date(),
      end: new Date(),
      addressId: 1,
      participantsMin: 1,
      category: $Enums.EventCategory.CATEGORY_1,
      image: null,
      status: $Enums.EventStatus.PENDING,
    }

    it('should create a flag successfully (first flag for target/reason)', async () => {
      // Simulate the scenario where the flag does not exist yet, the target exists, and the flag is created successfully
      mockPrismaService.flag.findUnique.mockResolvedValue(null); // Flag does not exist
      mockPrismaService.event.findUnique.mockResolvedValue(mockEvent); // Target exists
      mockPrismaService.flag.create.mockResolvedValue(mockCreatedFlag); // Simulate flag creation
      mockPrismaService.flag.count.mockResolvedValue(1); // First report for this target/reason

      // Act: Call the method being tested
      const result = await service.create(createFlagDto);

      // Assert: Verify the result and mock interactions
      expect(result).toEqual(mockCreatedFlag);
      expect(mockPrismaService.flag.findUnique).toHaveBeenCalledWith({ where: { userId_target_targetId: { userId, target: createFlagDto.target, targetId } } });
      expect(mockPrismaService.event.findUnique).toHaveBeenCalledWith({ where: { id: targetId } });
      expect(mockPrismaService.flag.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          reason: createFlagDto.reason,
          target: createFlagDto.target,
          User: { connect: { id: userId } },
          Event: { connect: { id: targetId } },
        }),
        include: { Event: true }
      });
      expect(mockPrismaService.flag.count).toHaveBeenCalledWith({ where: { targetId, target: createFlagDto.target, reason: createFlagDto.reason } });
      expect(mockPrismaService.event.delete).not.toHaveBeenCalled();
      expect(mockNotificationsService.create).not.toHaveBeenCalled();
    });

    it('should create a flag, delete target, and send notification if count reaches 3', async () => {
      // Simulate the scenario where the flag count reaches the threshold (3), triggering target deletion and notification
      mockPrismaService.flag.findUnique.mockResolvedValue(null);
      mockPrismaService.event.findUnique.mockResolvedValue(mockEvent);
      mockPrismaService.flag.create.mockResolvedValue(mockCreatedFlag);
      mockPrismaService.flag.count.mockResolvedValue(3); // Third report triggers deletion

      const mockDeletedEventWithUser = {
        ...mockEvent,
        User: { id: mockEvent.userId, email: 'owner@example.com', Profile: { mailSub: true } }
      };
      mockPrismaService.Event.delete.mockResolvedValue(mockDeletedEventWithUser);

      mockNotificationsService.create.mockResolvedValue(undefined); // Simulate notification creation

      // Act
      const result = await service.create(createFlagDto);

      // Assert
      expect(result).toEqual(mockCreatedFlag);
      expect(mockPrismaService.flag.create).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.flag.count).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.Event.delete).toHaveBeenCalledWith({ where: { id: targetId }, include: { User: { select: { id: true, email: true, Profile: { select: { mailSub: true } } } } } });
      expect(mockNotificationsService.create).toHaveBeenCalledTimes(1);
      expect(mockNotificationsService.create).toHaveBeenCalledWith(
        expect.objectContaining({ id: mockDeletedEventWithUser.User.id }),
        expect.objectContaining({ type: $Enums.NotificationType.FLAG, title: expect.stringContaining('supprimé') })
      );
    });

    it('should throw ConflictException if flag already exists', async () => {
      // Simulate the scenario where the flag already exists, throwing a ConflictException
      mockPrismaService.flag.findUnique.mockResolvedValue(mockCreatedFlag);

      // Act & Assert
      await expect(service.create(createFlagDto)).rejects.toThrow(
        new HttpException('ce flag existe deja', HttpStatus.CONFLICT)
      );
      expect(mockPrismaService.flag.create).not.toHaveBeenCalled();
      expect(mockPrismaService.flag.count).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if target event does not exist', async () => {
      // Simulate the scenario where the target event does not exist, throwing a BadRequestException
      mockPrismaService.flag.findUnique.mockResolvedValue(null);
      mockPrismaService.event.findUnique.mockResolvedValue(null); // Target does not exist

      // Act & Assert
      await expect(service.create(createFlagDto)).rejects.toThrow(
        new HttpException('Invalid targetId for EVENT', HttpStatus.BAD_REQUEST)
      );
      expect(mockPrismaService.flag.create).not.toHaveBeenCalled();
    });
  });
});
