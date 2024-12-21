import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as argon2 from 'argon2';
import { User } from '@prisma/client';

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, PrismaService],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const hashedPassword = await argon2.hash(createUserDto.password);
      const user: User = {
        id: 1,
        email: createUserDto.email,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastConnection: new Date(),
      };

      jest.spyOn(prismaService.user, 'create').mockResolvedValue(user);

      expect(await service.create(createUserDto)).toEqual(user);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users: User[] = [
        { id: 1, email: 'test1@example.com', password: 'password1', createdAt: new Date(), updatedAt: new Date(), lastConnection: new Date() },
        { id: 2, email: 'test2@example.com', password: 'password2', createdAt: new Date(), updatedAt: new Date(), lastConnection: new Date() },
      ];

      jest.spyOn(prismaService.user, 'findMany').mockResolvedValue(users);

      expect(await service.findAll()).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      const user: User = {
        id: 1,
        email: 'test@example.com',
        password: 'password123',
        createdAt: new Date(),
        updatedAt: new Date(),
        lastConnection: new Date()
      };

      jest.spyOn(prismaService.user, 'findUniqueOrThrow').mockResolvedValue(user);

      expect(await service.findOne(1)).toEqual(user);
    });
  });

  describe('findUnique', () => {
    it('should return a single user by email', async () => {
      const user: User = {
        id: 1,
        email: 'test@example.com',
        password: 'password123',
        createdAt: new Date(),
        updatedAt: new Date(),
        lastConnection: new Date()
      };

      jest.spyOn(prismaService.user, 'findUniqueOrThrow').mockResolvedValue(user);

      expect(await service.findUnique('test@example.com')).toEqual(user);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = {
        email: 'updated@example.com',
        password: 'newpassword123',
      };

      const hashedPassword = await argon2.hash(updateUserDto.password);
      const user: User = {
        id: 1,
        email: updateUserDto.email,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastConnection: new Date(),
      };

      jest.spyOn(prismaService.user, 'update').mockResolvedValue(user);

      expect(await service.update(1, updateUserDto)).toEqual(user);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const user: User = {
        id: 1,
        email: 'test@example.com',
        password: 'password123',
        createdAt: new Date(),
        updatedAt: new Date(),
        lastConnection: new Date()
      };

      jest.spyOn(prismaService.user, 'delete').mockResolvedValue(user);

      expect(await service.remove(1)).toEqual(user);
    });
  });
})