import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../src/prisma/prisma.service';
import { GroupsController } from '../groups/groups.controller';
import { GroupsService } from '../groups/groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Group, } from '@prisma/client';
import { AddressController } from '../addresses/address.controller';
import { AddressService } from '../addresses/address.service';
import { JwtModule } from '@nestjs/jwt';
import { RequestWithUser } from '../auth/auth.entities/auth.entity';

describe('GroupsController', () => {
  let controller: GroupsController;
  let service: GroupsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({})], // Add this line
      controllers: [GroupsController, AddressController],
      providers: [
        GroupsService,
        AddressService,

        {
          provide: PrismaService,
          useValue: {
            group: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUniqueOrThrow: jest.fn(),
              findAllByUserId: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    controller = module.get<GroupsController>(GroupsController);
    service = module.get<GroupsService>(GroupsService);
  });




  const groupExampleDto: CreateGroupDto = { name: 'Test Group', rules: 'Test Rules', addressId: 1, area: 10 };
  const groupExample: Group = { id: 1, createdAt: new Date(), updatedAt: new Date(), ...groupExampleDto };



  it('should create a group with address', async () => {
    jest.spyOn(service, 'create').mockResolvedValue(groupExample);
    const created = await controller.create(groupExampleDto);
    expect(created).toEqual(groupExample);
  });

  it('should return all groups with details', async () => {
    const groups: Group[] = [groupExample];
    jest.spyOn(service, 'findAll').mockResolvedValue(groups);
    expect(await controller.findAll()).toEqual(groups);
  });

  it('should return all groups by user id', async () => {
    const groups: Group[] = [groupExample];
    jest.spyOn(service, 'findAllByUserId').mockResolvedValue(groups);
    expect(await controller.findAllByUserId(1)).toEqual(groups);
  });

  it('should return a single group', async () => {
    const group: Group = groupExample;
    jest.spyOn(service, 'findOne').mockResolvedValue(group);
    expect(await controller.findOne(1)).toEqual(group);
  });

  it('should return my group', async () => {
    const groups: Group[] = [groupExample];
    jest.spyOn(service, 'findAllByUserId').mockResolvedValue(groups);
    const Req = { user: { sub: 1 } } as RequestWithUser;
    expect(await controller.findMine(Req)).toEqual(groups);
  });

  it('should update a group', async () => {
    const updateGroupDto: UpdateGroupDto = { ...groupExampleDto };
    jest.spyOn(service, 'update').mockResolvedValue(groupExample);
    expect(await controller.update(1, updateGroupDto)).toEqual(groupExample);
  });

  it('should delete a group', async () => {
    const group: Group = groupExample;
    jest.spyOn(service, 'remove').mockResolvedValue(group);
    expect(await controller.remove(1)).toEqual(group);
  });
});
