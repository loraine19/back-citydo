import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';
import { Group } from '@prisma/client';
import { UpdateGroupDto } from './dto/update-group.dto';
import { CreateGroupDto } from './dto/create-group.dto';



@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) { }
  async create(data: CreateGroupDto): Promise<Group> {
    const { addressId, ...group } = data
    return await this.prisma.group.create({ data: { ...group, Address: { connect: { id: addressId } } } });
  }

  async findAll(): Promise<Group[]> {
    return await this.prisma.group.findMany({
      include: {
        GroupUser: {
          include: { User: { select: { id: true, email: true, Profile: true } } }
        }
      },
    });
  }

  async findOne(id: number): Promise<Group> {
    return await this.prisma.group.findUniqueOrThrow({
      where: { id },
      include: {
        GroupUser: {
          where: { groupId: id },
          include: { User: { select: { id: true, email: true, Profile: true } } }
        }
      }
    })
  }

  async findAllByUserId(userId: number): Promise<Group[]> {
    const groups = await this.prisma.group.findMany({
      where: { GroupUser: { every: { User: { id: userId } } } }
    })
    if (groups.length === 0) throw new HttpException('User not found in any group', HttpStatus.NO_CONTENT)
    return groups
  }

  async findNearestGroups(userId: number): Promise<Group[]> {
    const user = await this.prisma.user.findUnique(
      { where: { id: userId }, include: { Profile: { include: { Address: true } } } })
    const where = user.Profile.Address.city ? { Address: { city: user.Profile.Address.city } } : {}
    const groups = await this.prisma.group.findMany({ where })
    return groups
  }



  async update(id: number, data: UpdateGroupDto): Promise<Group> {
    const { addressId, ...group } = data
    return await this.prisma.group.update({
      where: { id },
      data: { ...group, Address: { connect: { id: addressId } } }
    });
  }

  async remove(id: number): Promise<Group> {
    return await this.prisma.group.delete({ where: { id } });
  }
}
