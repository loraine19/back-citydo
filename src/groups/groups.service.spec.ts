import { Test, TestingModule } from '@nestjs/testing';
import { GroupsService } from '../groups/groups.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { $Enums, Group } from '@prisma/client';

describe('GroupsService', () => {
  let service: GroupsService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupsService,
        {
          provide: PrismaService,
          useValue: {
            group: {
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

    service = module.get<GroupsService>(GroupsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  const groupExampleDto: CreateGroupDto = { name: 'Test Group', rules: 'Test Rules', addressId: 1, area: 10 };
  const groupExample: Group = { id: 1, createdAt: new Date(), updatedAt: new Date(), ...groupExampleDto };

  it('should create a group ', async () => {
    jest.spyOn(prismaService.group, 'create').mockResolvedValue(groupExample);
    expect(await service.create(groupExampleDto)).toEqual(groupExample);
  });

  it('should return all groups ', async () => {
    const groups: Group[] = [groupExample];
    jest.spyOn(prismaService.group, 'findMany').mockResolvedValue(groups);
    expect(await service.findAll()).toEqual(groups);
  });

  it('should return all groups by user id', async () => {
    const groups: Group[] = [groupExample];
    jest.spyOn(prismaService.group, 'findMany').mockResolvedValue(groups);
    expect(await service.findAllByUserId(1)).toEqual(groups);
  });

  it('should return a single group ', async () => {
    jest.spyOn(prismaService.group, 'findUniqueOrThrow').mockResolvedValue(groupExample);
    expect(await service.findOne(1)).toEqual(groupExample);
  });

  it('should update a group ', async () => {
    const updateGroupDto: UpdateGroupDto = { ...groupExampleDto };
    jest.spyOn(prismaService.group, 'update').mockResolvedValue(groupExample);
    expect(await service.update(1, updateGroupDto)).toEqual(groupExample);
  });

  it('should delete a group ', async () => {
    jest.spyOn(prismaService.group, 'delete').mockResolvedValue(groupExample);
    expect(await service.remove(1)).toEqual(groupExample);
  });
});
