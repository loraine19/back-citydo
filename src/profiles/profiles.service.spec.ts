import { Test, TestingModule } from '@nestjs/testing';
import { ProfilesService } from './profiles.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile, $Enums } from '@prisma/client';

describe('ProfilesService', () => {
  let service: ProfilesService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfilesService,
        {
          provide: PrismaService,
          useValue: {
            profile: {
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

    service = module.get<ProfilesService>(ProfilesService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  const profileExampleDto: CreateProfileDto = { userId: 1, firstName: 'Test', lastName: 'User', image: 'test.jpg', skills: 'Test Skills', assistance: $Enums.Assistance.NONE, phone: '1234567890', addressId: 1, addressShared: true, points: 0, userIdSp: 2 };
  const profileExample: Profile = { id: 1, createdAt: new Date(), updatedAt: new Date(), ...profileExampleDto };

  it('should create a profile', async () => {
    jest.spyOn(prismaService.profile, 'create').mockResolvedValue(profileExample);
    expect(await service.create(profileExampleDto)).toEqual(profileExample);
  });

  it('should return all profiles', async () => {
    const profiles: Profile[] = [profileExample];
    jest.spyOn(prismaService.profile, 'findMany').mockResolvedValue(profiles);
    expect(await service.findAll()).toEqual(profiles);
  });

  it('should return a single profile', async () => {
    jest.spyOn(prismaService.profile, 'findUniqueOrThrow').mockResolvedValue(profileExample);
    expect(await service.findOne(1)).toEqual(profileExample);
  });

  it('should update a profile', async () => {
    const updateProfileDto: UpdateProfileDto = { ...profileExampleDto };
    jest.spyOn(prismaService.profile, 'update').mockResolvedValue(profileExample);
    expect(await service.update(1, updateProfileDto)).toEqual(profileExample);
  });

  it('should delete a profile', async () => {
    jest.spyOn(prismaService.profile, 'delete').mockResolvedValue(profileExample);
    expect(await service.remove(1)).toEqual(profileExample);
  });
});
