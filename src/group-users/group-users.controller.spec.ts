import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../src/prisma/prisma.service';
import { GroupUsersController } from './group-users.controller';
import { GroupUsersService } from './group-users.service';
import { CreateGroupUserDto } from './dto/create-group-user.dto';
import { UpdateGroupUserDto } from './dto/update-group-user.dto';
import { GroupUser } from '@prisma/client';
import { JwtModule } from '@nestjs/jwt';


describe('GroupUsersController', () => {
  let controller: GroupUsersController;
  let service: GroupUsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({})],
      controllers: [GroupUsersController],
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

    controller = module.get<GroupUsersController>(GroupUsersController);
    service = module.get<GroupUsersService>(GroupUsersService);
  });

  const groupUserExampleDto: CreateGroupUserDto = { userId: 1, groupId: 1, role: 'MEMBER' };
  const groupUserExample: GroupUser = { createdAt: new Date(), updatedAt: new Date(), ...groupUserExampleDto };

  it('should create a group user with address', async () => {
    jest.spyOn(service, 'create').mockResolvedValue(groupUserExample);
    const created = await controller.create(groupUserExampleDto);
    expect(created).toEqual(groupUserExample);
  });

  it('should return all group users with details', async () => {
    const groupUsers: GroupUser[] = [groupUserExample];
    jest.spyOn(service, 'findAll').mockResolvedValue(groupUsers);
    expect(await controller.findAll()).toEqual(groupUsers);
  });


  it('should return a single group user', async () => {
    const groupUser: GroupUser = groupUserExample;
    jest.spyOn(service, 'findOne').mockResolvedValue(groupUser);
    expect(await controller.findOne(1, 1)).toEqual(groupUser);
  });


  it('should update a group user', async () => {
    const updateGroupUserDto: UpdateGroupUserDto = { ...groupUserExampleDto };
    jest.spyOn(service, 'update').mockResolvedValue(groupUserExample);
    expect(await controller.update(1, 1, updateGroupUserDto)).toEqual(groupUserExample);
  });

  it('should delete a group user', async () => {
    const groupUser: GroupUser = groupUserExample;
    jest.spyOn(service, 'remove').mockResolvedValue(groupUser);
    expect(await controller.remove(1, 1)).toEqual(groupUser);
  });
});
