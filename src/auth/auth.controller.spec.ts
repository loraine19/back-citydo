import { JwtService } from "@nestjs/jwt";
import { TestingModule, Test } from "@nestjs/testing";
import { PrismaService } from "../prisma/prisma.service";
import { AuthController } from "../auth/auth.controller";
import { AuthService } from "./auth.service";
import { UsersService } from "../../src/users/users.service";
import { AuthEntity, RequestWithUser } from "./auth.entities/auth.entity";

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
          },
        },
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

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });


  const userExampleDto = { email: 'test@mail.com', password: 'passwordtest' };
  const userExample = { id: 1, createdAt: new Date(), updatedAt: new Date(), lastConnection: new Date(), verified: true, ...userExampleDto };
  const refreshTokenDto: AuthEntity = { refreshToken: 'mockToken', accessToken: 'mockToken' };

  it('should return a token on signIn', async () => {
    const result = { accessToken: 'mockToken', refreshToken: 'mockToken' };
    jest.spyOn(service, 'signIn').mockResolvedValue(result);
    expect(await controller.signin(userExampleDto)).toBe(result);
  });


  it('should return a token on signUP', async () => {
    const result = { accessToken: 'mockToken', refreshToken: 'mockToken' };
    jest.spyOn(service, 'signUp').mockResolvedValue(result);
    expect(await controller.signup(userExampleDto)).toBe(result);
  });

  it('should return a RefreshToken', async () => {
    const result = { accessToken: 'mockToken', refreshToken: 'mockToken' };
    jest.spyOn(service, 'refresh').mockResolvedValue(result);
    const req = { user: { sub: 1 } } as RequestWithUser;
    expect(await controller.refresh(refreshTokenDto, req)).toBe(result);
  });

})
