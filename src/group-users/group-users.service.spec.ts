import { Test, TestingModule } from '@nestjs/testing';
import { GroupUsersService } from './group-users.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGroupUserDto } from './dto/create-group-user.dto';
import { UpdateGroupUserDto } from './dto/update-group-user.dto';
import { GroupUser, $Enums } from '@prisma/client';

describe('GroupUsersService', () => {
  let service: GroupUsersService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupUsersService,
        {
          provide: PrismaService,
          useValue: {
            groupUser: {
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

    service = module.get<GroupUsersService>(GroupUsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  const groupUserExampleDto: CreateGroupUserDto = { userId: 1, groupId: 1, role: $Enums.Role.MEMBER };
  const groupUserExample: GroupUser = { createdAt: new Date(), updatedAt: new Date(), ...groupUserExampleDto };

  it('should create a group user', async () => {
    jest.spyOn(prismaService.groupUser, 'create').mockResolvedValue(groupUserExample);
    expect(await service.create(groupUserExampleDto)).toEqual(groupUserExample);
  });

  it('should return all group users', async () => {
    const groupUsers: GroupUser[] = [groupUserExample];
    jest.spyOn(prismaService.groupUser, 'findMany').mockResolvedValue(groupUsers);
    expect(await service.findAll()).toEqual(groupUsers);
  });

  it('should return a single group user', async () => {
    jest.spyOn(prismaService.groupUser, 'findUniqueOrThrow').mockResolvedValue(groupUserExample);
    expect(await service.findOne(1, 1)).toEqual(groupUserExample);
  });

  it('should update a group user', async () => {
    const updateGroupUserDto: UpdateGroupUserDto = { ...groupUserExampleDto };
    jest.spyOn(prismaService.groupUser, 'update').mockResolvedValue(groupUserExample);
    expect(await service.update(updateGroupUserDto)).toEqual(groupUserExample);
  });

  it('should delete a group user', async () => {
    jest.spyOn(prismaService.groupUser, 'delete').mockResolvedValue(groupUserExample);
    expect(await service.remove(1, 1)).toEqual(groupUserExample);
  });
});
