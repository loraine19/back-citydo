import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../src/prisma/prisma.service';
import { ProfilesController } from '../profiles/profiles.controller';
import { ProfilesService } from '../profiles/profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { $Enums, Profile } from '@prisma/client';
import { JwtModule } from '@nestjs/jwt';
import { RequestWithUser } from 'src/auth/auth.entities/auth.entity';

describe('ProfilesController', () => {
  let controller: ProfilesController;
  let service: ProfilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({})],
      controllers: [ProfilesController],
      providers: [
        ProfilesService,
        {
          provide: PrismaService,
          useValue: {
            profile: {
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

    controller = module.get<ProfilesController>(ProfilesController);
    service = module.get<ProfilesService>(ProfilesService);
  });

  const profileExampleDto: CreateProfileDto = {
    userId: 1, firstName: 'Test', lastName: 'User', image: 'test.jpg', skills: 'Test Skills', assistance: $Enums.AssistanceLevel.LEVEL_0, phone: '1234567890', addressId: 1, addressShared: true, points: 0, userIdSp: 2
  };
  const profileExample: Profile = { userId: 1, createdAt: new Date(), updatedAt: new Date(), ...profileExampleDto };

  it('should create a profile', async () => {
    jest.spyOn(service, 'create').mockResolvedValue(profileExample);
    const image = null;
    const created = await controller.create(profileExampleDto, image);
    expect(created).toEqual(profileExample);
  });

  it('should return all profiles', async () => {
    const profiles: Profile[] = [profileExample];
    jest.spyOn(service, 'findAll').mockResolvedValue(profiles);
    expect(await controller.findAll()).toEqual(profiles);
  });


  it('should return a single profile', async () => {
    const profile: Profile = profileExample;
    jest.spyOn(service, 'findOne').mockResolvedValue(profile);
    expect(await controller.findOne(1)).toEqual(profile);
  });

  it('should return my profile', async () => {
    jest.spyOn(service, 'findOneByUserId').mockResolvedValue(profileExample);
    const Req = { user: { sub: 1 } } as RequestWithUser;
    expect(await controller.findMine(Req)).toEqual(profileExample);
  });


  it('should return one profile by userId', async () => {
    jest.spyOn(service, 'findOneByUserId').mockResolvedValue(profileExample);
    expect(await controller.findOneByUserId(1)).toEqual(profileExample);
  });

  it('should update a profile', async () => {
    const updateProfileDto: UpdateProfileDto = { ...profileExampleDto };
    const image = null
    jest.spyOn(service, 'update').mockResolvedValue(profileExample);
    expect(await controller.update(1, updateProfileDto, image)).toEqual(profileExample);
  });

  it('should delete a profile', async () => {
    const profile: Profile = profileExample;
    jest.spyOn(service, 'remove').mockResolvedValue(profile);
    expect(await controller.remove(1)).toEqual(profile);
  });
});
