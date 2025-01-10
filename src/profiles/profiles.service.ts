import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';
import { Profile } from '@prisma/client';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ImageInterceptor } from 'middleware/ImageInterceptor';
//// SERVICE MAKE ACTION
@Injectable()
export class ProfilesService {
  constructor(private prisma: PrismaService,) { }
  async create(data: CreateProfileDto): Promise<Profile> {
    const { userId, addressId, userIdSp, ...profile } = data
    const cond = await this.prisma.profile.findFirst({ where: { userId: userId } });
    if (cond) { throw new HttpException(`Profile already exists for user ${userId}`, HttpStatus.CONFLICT) }
    const createData: any = { ...profile, User: { connect: { id: userId } }, Address: { connect: { id: addressId } } };

    if (userIdSp) {
      createData.UserSp = { connect: { id: userIdSp } };
    }

    return await this.prisma.profile.create({
      data: createData
    });
  }
  async update(data: UpdateProfileDto): Promise<Profile> {
    const { userId, addressId, userIdSp, ...profile } = data;
    const updateData: any = { ...profile, User: { connect: { id: userId } }, Address: { connect: { id: addressId } } };


    if (userId) {
      updateData.User = { connect: { id: userId } };
    }
    if (addressId) {
      updateData.Address = { connect: { id: addressId } };
    }
    if (userIdSp) {
      updateData.UserSp = { connect: { id: userIdSp } };
    }

    return await this.prisma.profile.update({
      where: { userId },
      data: updateData,
    });
  }


  async findAll(): Promise<Profile[]> {
    return await this.prisma.profile.findMany();
  }

  async findOneByUserId(userId: number): Promise<Profile> {
    return this.prisma.profile.findFirstOrThrow({ where: { userId } })
  }

  async findOne(id: number): Promise<Profile> {
    return await this.prisma.profile.findUniqueOrThrow({
      where: { userId: id },
    });

  }

  async remove(id: number): Promise<Profile> {
    const element = await this.prisma.profile.findUniqueOrThrow({ where: { userId: id } });
    element.image && ImageInterceptor.deleteImage(element.image)
    return await this.prisma.profile.delete({ where: { userId: id } });
  }
}
