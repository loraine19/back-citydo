import { JwtService } from "@nestjs/jwt";
import { TestingModule, Test } from "@nestjs/testing";
import { PrismaService } from "../prisma/prisma.service";
import { AuthController } from "../auth/auth.controller";
import { AuthService } from "./auth.service";
import { SignInDto } from "./dto/signIn.dto";
import { UsersService } from "../../src/users/users.service";

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


  it('should return a token on signIn', async () => {
    const signInDto: SignInDto = { email: 'testuser@example.com', password: 'testpass' };
    const result = { accessToken: 'mockToken', refreshToken: 'mockToken' };
    jest.spyOn(service, 'signIn').mockResolvedValue(result);
    expect(await controller.signin(signInDto)).toBe(result);
  });
})
