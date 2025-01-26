import { Body, Injectable, NotFoundException, ParseIntPipe } from '@nestjs/common';
import { GroupUser, Profile } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGroupUserDto } from './dto/create-group-user.dto';
import { UpdateGroupUserDto } from './dto/update-group-user.dto';

//// SERVICE MAKE ACTION
@Injectable()
export class GroupUsersService {
  constructor(private prisma: PrismaService) { }
  async create(data: CreateGroupUserDto): Promise<GroupUser> {
    const { userId, groupId, ...groupUser } = data
    return await this.prisma.groupUser.create({ data: { ...groupUser, User: { connect: { id: userId } }, Group: { connect: { id: groupId } } } })
  }


  async update(data: UpdateGroupUserDto): Promise<GroupUser> {
    const { userId, groupId, ...groupUser } = data
    return await this.prisma.groupUser.update({
      where: { userId_groupId: { groupId, userId } },
      data: { ...groupUser, User: { connect: { id: userId } }, Group: { connect: { id: groupId } } }
    });
  }

  async remove(userId: number, groupId: number): Promise<GroupUser> {
    return await this.prisma.groupUser.delete({ where: { userId_groupId: { groupId, userId } }, });
  }
}
