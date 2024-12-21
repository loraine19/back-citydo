import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              findUniqueOrThrow: jest.fn(),
              create: jest.fn(),
            },
            token: {
              deleteMany: jest.fn(),
              create: jest.fn(),
              findFirst: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mockToken'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  const userTest = { email: 'test@mail.com', password: 'passwordtest' };

  it('should return a token on signIn', async () => {
    jest.spyOn(prismaService.user, 'findUniqueOrThrow').mockResolvedValue({
      id: 1,
      email: userTest.email,
      password: await argon2.hash(userTest.password),
      createdAt: new Date(),
      updatedAt: new Date(),
      lastConnection: new Date(),
    });

    const token = await service.signIn(userTest);
    expect(token.accessToken).toBe('mockToken');
    expect(token.refreshToken).toBe('mockToken');
  });

  it('should throw UnauthorizedException on invalid password', async () => {
    jest.spyOn(prismaService.user, 'findUniqueOrThrow').mockResolvedValue({
      id: 1,
      email: userTest.email,
      password: await argon2.hash('wrongpassword'),
      createdAt: new Date(),
      updatedAt: new Date(),
      lastConnection: new Date(),
    });

    await expect(service.signIn(userTest)).rejects.toThrow(UnauthorizedException);
  });

  it('should throw ConflictException on signUp if user already exists', async () => {
    jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue({
      id: 1,
      email: userTest.email,
      password: await argon2.hash(userTest.password),
      createdAt: new Date(),
      updatedAt: new Date(),
      lastConnection: new Date(),
    });

    await expect(service.signUp(userTest)).rejects.toThrow(ConflictException);
  });

  it('should create a new user and return tokens on signUp', async () => {
    jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);
    jest.spyOn(prismaService.user, 'create').mockResolvedValue({
      id: 1,
      email: userTest.email,
      password: await argon2.hash(userTest.password),
      createdAt: new Date(),
      updatedAt: new Date(),
      lastConnection: new Date(),
    });

    const token = await service.signUp(userTest);
    expect(token.accessToken).toBe('mockToken');
    expect(token.refreshToken).toBe('mockToken');
  });

  it('should refresh token', async () => {
    jest.spyOn(prismaService.token, 'findFirst').mockResolvedValue({
      userId: 1,
      token: await argon2.hash('mockToken'),
      type: 'REFRESH',
      createdAt: new Date(),
      updatedAt: new Date(),
      expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 1 week from now
    });

    const token = await service.refresh('mockToken', 1);
    expect(token.accessToken).toBe('mockToken');
    expect(token.refreshToken).toBe('mockToken');
  });

  it('should throw UnauthorizedException on invalid refresh token', async () => {
    jest.spyOn(prismaService.token, 'findFirst').mockResolvedValue({
      userId: 1,
      token: await argon2.hash('wrongToken'),
      type: 'REFRESH',
      createdAt: new Date(),
      updatedAt: new Date(),
      expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 1 week from now
    });

    await expect(service.refresh('mockToken', 1)).rejects.toThrow(UnauthorizedException);
  });
});