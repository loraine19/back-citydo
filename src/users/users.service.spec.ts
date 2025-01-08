import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { $Enums, User } from '@prisma/client';
import * as argon2 from 'argon2';

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUniqueOrThrow: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  const userExampleDto: CreateUserDto = { email: 'test@example.com', password: 'password', verified: $Enums.UserStatus.ACTIVE };
  const hashedPassword = argon2.hash(userExampleDto.password);
  const userExample: User = { id: 1, createdAt: new Date(), updatedAt: new Date(), lastConnection: new Date(), password: hashedPassword, ...userExampleDto };

  it('should create a user', async () => {
    jest.spyOn(prismaService.user, 'create').mockResolvedValue(userExample);
    expect(await service.create(userExampleDto)).toEqual(userExample);
  });

  it('should return all users', async () => {
    const users: User[] = [userExample];
    jest.spyOn(prismaService.user, 'findMany').mockResolvedValue(users);
    expect(await service.findAll()).toEqual(users);
  });

  it('should return a single user', async () => {
    const user: User = userExample;
    jest.spyOn(prismaService.user, 'findUniqueOrThrow').mockResolvedValue(user);
    expect(await service.findOne(1)).toEqual(user);
  });

  it('should update a user', async () => {
    const updateUserDto: UpdateUserDto = { ...userExampleDto };
    jest.spyOn(prismaService.user, 'findUniqueOrThrow').mockResolvedValue(userExample);
    jest.spyOn(prismaService.user, 'update').mockResolvedValue(userExample);
    expect(await service.update(1, updateUserDto)).toEqual(userExample);
  });

  it('should delete a user', async () => {
    const user: User = userExample;
    jest.spyOn(prismaService.user, 'delete').mockResolvedValue(user);
    expect(await service.remove(1)).toEqual(user);
  });
});
