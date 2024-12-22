import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../src/prisma/prisma.service';
import { UsersController } from '../users/users.controller';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';


describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mockToken'),
            verifyAsync: jest.fn().mockResolvedValue({ sub: 1 }),
          },
        },
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
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

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  const userExampleDto: CreateUserDto = { email: 'test@example.com', password: 'password' };
  const hashedPassword = argon2.hash(userExampleDto.password);
  const userExample: User = { id: 1, createdAt: new Date(), updatedAt: new Date(), lastConnection: new Date(), password: hashedPassword, ...userExampleDto };

  it('should create a user', async () => {
    jest.spyOn(service, 'create').mockResolvedValue(userExample);
    expect(await controller.create(userExampleDto)).toEqual(userExample);
  });

  it('should return all users', async () => {
    const users: User[] = [userExample];
    jest.spyOn(service, 'findAll').mockResolvedValue(users);
    expect(await controller.findAll()).toEqual(users);
  });

  it('should return a single user', async () => {
    const user: User = userExample;
    jest.spyOn(service, 'findOne').mockResolvedValue(user);
    expect(await controller.findOne(1)).toEqual(user);
  });

  it('should update a user', async () => {
    const updateUserDto: UpdateUserDto = { ...userExampleDto };
    jest.spyOn(service, 'update').mockResolvedValue(userExample);
    expect(await controller.update(1, updateUserDto)).toEqual(userExample);
  });

  it('should delete a user', async () => {
    const user: User = userExample;
    jest.spyOn(service, 'remove').mockResolvedValue(user);
    expect(await controller.remove(1)).toEqual(user);
  });
});
