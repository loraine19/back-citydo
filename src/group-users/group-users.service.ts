import { Body, Injectable, NotFoundException, ParseIntPipe } from '@nestjs/common';
import { $Enums, GroupUser, Profile } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGroupUserDto } from './dto/create-group-user.dto';
import { UpdateGroupUserDto } from './dto/update-group-user.dto';

//// SERVICE MAKE ACTION
@Injectable()
export class GroupUsersService {
  constructor(private prisma: PrismaService) { }


  async create(userId: number, groupId: number, modo: boolean): Promise<GroupUser> {
    const groupUser = modo ? $Enums.Role.MODO : $Enums.Role.MEMBER;
    return await this.prisma.groupUser.create({
      data: { role: groupUser, User: { connect: { id: userId } }, Group: { connect: { id: groupId } } }
    });
  }

  async update(userId: number, groupId: number, modo: boolean): Promise<GroupUser> {
    const groupUser = modo ? $Enums.Role.MODO : $Enums.Role.MEMBER;
    return await this.prisma.groupUser.update({
      where: { userId_groupId: { groupId, userId } },
      data: { role: groupUser, User: { connect: { id: userId } }, Group: { connect: { id: groupId } } }
    });
  }


  async updateAll(userId: number, data: CreateGroupUserDto[]): Promise<GroupUser[]> {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { GroupUser: true } });
    const groups = data
    const groupToDelete = user.GroupUser.filter((groupUser: GroupUser) => groups.find((g) => g.groupId !== groupUser.groupId))

    const groupsToUpdate = user.GroupUser.filter((groupUser: GroupUser) => groups.find((g) => g.groupId === groupUser.groupId && g.role !== groupUser.role))

    console.log(data)
    const groupsToCreate = groups.filter((group: CreateGroupUserDto) => {
      return !user.GroupUser.find((groupUser: GroupUser) => group.groupId === groupUser.groupId)
    })

    console.log('groupsToCreate', groupsToCreate)

    for (const group of groupToDelete) {
      await this.prisma.groupUser.delete({ where: { userId_groupId: { groupId: group.groupId, userId } } });
    }

    for (const group of groupsToUpdate) {
      if (group.groupId) {
        await this.prisma.groupUser.update({ where: { userId_groupId: { groupId: group.groupId, userId } }, data: { role: group.role } });
      }
    }

    for (const group of groupsToCreate) {
      if (group.groupId) {
        await this.prisma.groupUser.create(
          {
            data: {
              role: group.role, User: { connect: { id: userId } },
              Group: { connect: { id: group.groupId } }
            }
          });
      }
    }

    return await this.prisma.groupUser.findMany({
      where: { userId },
      include: { Group: true }
    });

  }




}
