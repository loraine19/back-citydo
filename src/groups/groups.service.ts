import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
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
          include: {
            User:
            {
              select: {
                id: true,
                email: true,
                Profile: true
              }
            }
          }
        }
      },
    });
  }

  async findOne(id: number): Promise<Group> {
    return await this.prisma.group.findUnique({
      where: { id },
      include: {
        GroupUser: {
          where: { groupId: id },
          include: {
            User:
            {
              select: {
                id: true,
                email: true,
                Profile: true
              }
            }
          }
        }
      }

    })
  }

  async findOneUsers(id: number): Promise<Group> {
    return await this.prisma.group.findUnique({
      where: { id },
      include: {
        GroupUser: { include: { User: { select: { email: true, Profile: true, id: true } } } }
      },
    })
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
