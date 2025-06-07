import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';
import { Profile } from '@prisma/client';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ImageInterceptor } from 'middleware/ImageInterceptor';
import { AddressService } from 'src/addresses/address.service';
import { CreateAddressDto } from 'src/addresses/dto/create-address.dto';
//// SERVICE MAKE ACTION
@Injectable()
export class ProfilesService {
  constructor(private prisma: PrismaService, private addressService: AddressService) { }
  async create(data: CreateProfileDto): Promise<Profile> {
    const { userId, addressId, Address, ...profile } = data
    const addressIdVerified = await this.addressService.verifyAddress(Address);
    const cond = await this.prisma.profile.findFirst({ where: { userId: userId } });
    if (cond) { throw new HttpException(`msg: ${cond.firstName} vous avez déja un profile`, HttpStatus.CONFLICT) }
    const createData: any = { ...profile, User: { connect: { id: userId } }, Address: { connect: { id: addressIdVerified } } };

    return await this.prisma.profile.create({
      data: createData,
      include: { Address: true }
    });
  }

  async update(data: UpdateProfileDto, userId: number): Promise<Profile> {
    const { addressId, Address, userId: userIdC, ...profile } = data;
    if (userIdC !== userId) throw new HttpException('msg: Vous n\'avez pas les droits de modifier cet utilisateur', 403)
    const addressIdVerified = await this.addressService.verifyAddress(Address);
    const updateData: any = { ...profile, User: { connect: { id: userId } }, Address: { connect: { id: addressIdVerified } } };
    if (userId) {
      updateData.User = { connect: { id: userId } };
    }
    return await this.prisma.profile.update({
      where: { userId },
      data: updateData,
      include: { Address: true }
    });
  }

  async findAll(): Promise<Profile[]> {
    return await this.prisma.profile.findMany();
  }

  async findOneByUserId(userId: number): Promise<Profile> {
    return this.prisma.profile.findFirstOrThrow({ where: { userId }, include: { Address: true } })
  }

  async findOne(id: number): Promise<Profile> {
    return await this.prisma.profile.findUniqueOrThrow({
      where: { userId: id },
      include: { Address: true }
    });
  }

  async remove(id: number): Promise<Profile> {
    const element = await this.prisma.profile.findUniqueOrThrow({ where: { userId: id } });
    element.image && ImageInterceptor.deleteImage(element.image)
    return await this.prisma.profile.delete({ where: { userId: id } });
  }
}
