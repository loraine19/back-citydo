import { Test, TestingModule } from '@nestjs/testing';
import { VotesService } from './votes.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { UsersService } from '../users/users.service';
import { CreateVoteDto } from './dto/create-vote.dto';
import { $Enums, Vote, Pool, User, Profile, GroupUser } from '@prisma/client';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UserNotifInfo } from '../notifications/entities/notification.entity';

// --- Mocks des dépendances ---
const mockPrismaService = {
  pool: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  survey: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  vote: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  profile: {
    update: jest.fn(),
  }
};

const mockNotificationsService = {
  create: jest.fn(),
  createMany: jest.fn(),
};

const mockUsersService = {
  usersInGroup: jest.fn(),
};

// --- Fin des mocks ---

describe('VotesService', () => {
  let service: VotesService;
  let prisma: PrismaService;
  let notificationsService: NotificationsService;
  let usersService: UsersService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VotesService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: NotificationsService, useValue: mockNotificationsService },
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    service = module.get<VotesService>(VotesService);
    prisma = module.get<PrismaService>(PrismaService);
    notificationsService = module.get<NotificationsService>(NotificationsService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // --- Tests pour la méthode create ---
  describe('create', () => {
    const voterUserId = 10;
    const creatorUserId = 1;
    const targetId = 5;
    const createVoteDto: CreateVoteDto = {
      userId: voterUserId,
      targetId: targetId,
      target: $Enums.VoteTarget.POOL,
      opinion: $Enums.VoteOpinion.OK,
    };

    //  Validation d'une cagnotte en atteignant 51%
    it('should validate pool when 51% is reached with an OK vote', async () => {
      const mockUsersInGroup: UserNotifInfo[] = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        email: `user${i + 1}@example.com`,
        GroupUser: [{ groupId: 1, role: $Enums.Role.MEMBER, userId: i + 1, createdAt: new Date(), updatedAt: new Date() }],
        Profile: { mailSub: $Enums.MailSubscriptions.SUB_1 }
      }));
      mockUsersService.usersInGroup.mockResolvedValue(mockUsersInGroup);

      const mockPoolCreator: User & { GroupUser: GroupUser[], Profile: Profile | null } = {
        id: creatorUserId,
        email: 'creator@example.com',
        status: $Enums.UserStatus.ACTIVE,
        password: 'hashedpassword', createdAt: new Date(),
        updatedAt: new Date(), lastConnection: new Date(),
        GroupUser: [{ groupId: 1, role: $Enums.Role.MEMBER, userId: creatorUserId, createdAt: new Date(), updatedAt: new Date() }],
        Profile: { userId: creatorUserId, addressId: null, firstName: 'Creator', lastName: 'Test', image: null, phone: null, mailSub: $Enums.MailSubscriptions.SUB_1, addressShared: false, assistance: $Enums.AssistanceLevel.LEVEL_0, points: 10, skills: null, createdAt: new Date(), updatedAt: new Date() }
      };
      const mockExistingVotes: Partial<Vote>[] = Array.from({ length: 5 }, (_, i) => ({
        userId: i + 20, // IDs différents
        targetId: targetId,
        target: $Enums.VoteTarget.POOL,
        opinion: $Enums.VoteOpinion.OK,
      }));
      const mockTargetPool: Partial<Pool & { User: any, Votes: Partial<Vote>[] }> = {
        id: targetId,
        userId: creatorUserId,
        User: mockPoolCreator,
        status: $Enums.PoolSurveyStatus.PENDING, // Statut initial
        Votes: mockExistingVotes, // 5 votes OK existants
        title: 'Test Pool',
        description: 'Test Desc',
        userIdBenef: 99,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPrismaService.pool.findUnique.mockResolvedValue(mockTargetPool as any);
      // pas encore de vote 
      mockPrismaService.vote.findUnique.mockResolvedValue(null);
      // nouveau vote
      const mockCreatedVote: Vote = {
        userId: voterUserId,
        targetId,
        target: $Enums.VoteTarget.POOL, opinion: $Enums.VoteOpinion.OK,
        createdAt: new Date(), updatedAt: new Date()
      };
      mockPrismaService.vote.create.mockResolvedValue(mockCreatedVote);
      mockPrismaService.pool.update.mockResolvedValue({ ...mockTargetPool, status: $Enums.PoolSurveyStatus.VALIDATED } as any);
      mockNotificationsService.create.mockResolvedValue(undefined);
      const result = await service.create({ ...createVoteDto, userId: voterUserId });

      // Vérifier le vote retourné
      expect(result).toEqual(mockCreatedVote);
      // Vérifier les appels importants
      expect(mockUsersService.usersInGroup).toHaveBeenCalledWith(creatorUserId, [1]);
      expect(mockPrismaService.pool.findUnique).toHaveBeenCalledWith({ where: { id: targetId }, select: expect.any(Object) });
      expect(mockPrismaService.vote.findUnique).toHaveBeenCalledWith({ where: { userId_target_targetId: { userId: voterUserId, targetId: targetId, target: $Enums.VoteTarget.POOL } } });
      expect(mockPrismaService.vote.create).toHaveBeenCalledTimes(1);
      // Vérifier que la mise à jour du statut 
      expect(mockPrismaService.pool.update).toHaveBeenCalledWith({
        where: { id: targetId },
        data: { status: $Enums.PoolSurveyStatus.VALIDATED }
      });
      // Vérifier que le beneficiaire a reçu ces points
      expect(mockPrismaService.profile.update).toHaveBeenCalledWith({
        where: { userId: mockTargetPool.userIdBenef },
        data: { points: { increment: 10 } }
      });
      // Vérifier que lé beneficiaire a reçu une notification
      // Vérifier que la notification au créateur a été appelée
      expect(mockNotificationsService.create).toHaveBeenCalledTimes(1);
      // Vérifier que createMany n'est PAS appelé pour un POOL
      expect(mockNotificationsService.createMany).not.toHaveBeenCalled();
    });


    // --- Cas où le vote ne fait PAS passer le seuil ---
    it('should create a vote but NOT validate pool (<51%)', async () => {
      const mockUsersInGroup: UserNotifInfo[] = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        email: `user${i + 1}@example.com`,
        GroupUser: [{ groupId: 1, role: $Enums.Role.MEMBER, userId: i + 1, createdAt: new Date(), updatedAt: new Date() }],
        Profile: { mailSub: $Enums.MailSubscriptions.SUB_1 }
      }));
      mockUsersService.usersInGroup.mockResolvedValue(mockUsersInGroup);

      const mockPoolCreator: User & { GroupUser: GroupUser[], Profile: Profile | null } = {
        id: creatorUserId,
        email: 'creator@example.com',
        status: $Enums.UserStatus.ACTIVE,
        password: 'pwd',
        createdAt: new Date(),
        updatedAt: new Date(),
        lastConnection: new Date(),
        GroupUser: [{ groupId: 1, role: $Enums.Role.MEMBER, userId: creatorUserId, createdAt: new Date(), updatedAt: new Date() }],
        Profile: { userId: creatorUserId, addressId: null, firstName: 'Creator', lastName: 'Test', image: null, phone: null, mailSub: $Enums.MailSubscriptions.SUB_1, addressShared: false, assistance: $Enums.AssistanceLevel.LEVEL_0, points: 10, skills: null, createdAt: new Date(), updatedAt: new Date() }
      };
      const mockExistingVotesNotEnough: Partial<Vote>[] = Array.from({ length: 3 }, (_, i) => ({
        userId: i + 30, // Nouveaux IDs 
        targetId: targetId,
        target: $Enums.VoteTarget.POOL,
        opinion: $Enums.VoteOpinion.OK,
      }));
      const mockTargetPoolNotEnoughVotes: Partial<Pool & { User: any, Votes: Partial<Vote>[] }> = {
        id: targetId,
        userId: creatorUserId,
        User: mockPoolCreator,
        status: $Enums.PoolSurveyStatus.PENDING, // Statut initial
        Votes: mockExistingVotesNotEnough, // SEULEMENT 3 votes OK existants
        title: 'Test Pool Not Enough', description: 'Test Desc', userIdBenef: 99, createdAt: new Date(), updatedAt: new Date(),
      };
      mockPrismaService.pool.findUnique.mockResolvedValue(mockTargetPoolNotEnoughVotes as any);
      // pas encore de vote
      mockPrismaService.vote.findUnique.mockResolvedValue(null);
      //le nouveau vote)
      const mockCreatedVote: Vote = {
        userId: voterUserId, targetId: targetId, target: $Enums.VoteTarget.POOL, opinion: $Enums.VoteOpinion.OK,
        createdAt: new Date(), updatedAt: new Date()
      };
      mockPrismaService.vote.create.mockResolvedValue(mockCreatedVote);
      mockNotificationsService.create.mockResolvedValue(undefined);

      const result = await service.create({ ...createVoteDto, userId: voterUserId }); // On vote OK

      expect(result).toEqual(mockCreatedVote); // Le vote est créé
      expect(mockUsersService.usersInGroup).toHaveBeenCalledWith(creatorUserId, [1]);
      expect(mockPrismaService.pool.findUnique).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.vote.findUnique).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.vote.create).toHaveBeenCalledTimes(1);
      // !! Vérifier que la mise à jour du statut n'a PAS été appelée !!
      expect(mockPrismaService.pool.update).not.toHaveBeenCalled();
      // Vérifier que la notification au créateur a bien été appelée
      expect(mockNotificationsService.create).toHaveBeenCalledTimes(1);
      // Vérifier que createMany (pour les surveys validés) n'est PAS appelé
      expect(mockNotificationsService.createMany).not.toHaveBeenCalled();
    });

    // ---  Cas où la Cible est Inexistante ---
    it('should throw NotFoundException if target pool does not exist', async () => {
      const voteOnNonExistentPoolDto: CreateVoteDto = {
        userId: voterUserId,
        targetId: 999,       // Un ID qui n'existe pas
        target: $Enums.VoteTarget.POOL,
        opinion: $Enums.VoteOpinion.OK,
      };

      mockPrismaService.pool.findUnique.mockResolvedValue(null);

      await expect(service.create(voteOnNonExistentPoolDto)).rejects.toThrow(
        new HttpException(`${$Enums.VoteTarget.POOL} n'existe pas`, HttpStatus.NOT_FOUND)
      );

      // Vérifier qu'aucune autre méthode n'a été appelée ensuite
      expect(mockUsersService.usersInGroup).not.toHaveBeenCalled();
      expect(mockPrismaService.vote.findUnique).not.toHaveBeenCalled();
      expect(mockPrismaService.vote.create).not.toHaveBeenCalled();
    });


    it('should throw NotFoundException if target survey does not exist', async () => {
      const voteOnNonExistentSurveyDto: CreateVoteDto = {
        userId: voterUserId, targetId: 998, target: $Enums.VoteTarget.SURVEY, opinion: $Enums.VoteOpinion.OK,
      };

      mockPrismaService.survey.findUnique.mockResolvedValue(null);
      mockPrismaService.pool.findUnique.mockResolvedValue(undefined);
      // Pour éviter interférence avec l'autre test si mock global

      await expect(service.create(voteOnNonExistentSurveyDto)).rejects.toThrow(
        new HttpException(`${$Enums.VoteTarget.SURVEY} n'existe pas`, HttpStatus.NOT_FOUND)
      );
      expect(mockUsersService.usersInGroup).not.toHaveBeenCalled();
      expect(mockPrismaService.vote.findUnique).not.toHaveBeenCalled();
      expect(mockPrismaService.vote.create).not.toHaveBeenCalled();
    })


    // pour le statut REJECTED
    it('should throw ForbiddenException if target pool is already closed (REJECTED)', async () => {
      const voteOnClosedPoolDto: CreateVoteDto = {
        userId: voterUserId, targetId: targetId,
        target: $Enums.VoteTarget.POOL,
        opinion: $Enums.VoteOpinion.OK
      };
      const mockRejectedPool: Partial<Pool> = {
        id: targetId,
        status: $Enums.PoolSurveyStatus.REJECTED, // <-- Cible clôturée
      };
      mockPrismaService.pool.findUnique.mockResolvedValue(mockRejectedPool as any);

      await expect(service.create(voteOnClosedPoolDto)).rejects.toThrow(
        new HttpException('Vous ne pouvez pas voter sur cette cagnotte/sondage car il est cloturé', 403)
      );
    });

  });
}); 