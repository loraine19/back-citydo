import { Body, Injectable, NotFoundException, ParseIntPipe } from '@nestjs/common';
import { $Enums, GroupUser, Profile } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGroupUserDto } from './dto/create-group-user.dto';
import { UpdateGroupUserDto } from './dto/update-group-user.dto';

//// SERVICE MAKE ACTION
@Injectable()
export class GroupUsersService {
  constructor(private prisma: PrismaService) { }



  async update(userId: number, groupId: number, modo: boolean): Promise<GroupUser> {
    const groupUser = modo ? $Enums.Role.MODO : $Enums.Role.MEMBER;
    console.log(userId, groupId, modo, groupUser)
    return await this.prisma.groupUser.update({
      where: { userId_groupId: { groupId, userId } },
      data: { role: groupUser, User: { connect: { id: userId } }, Group: { connect: { id: groupId } } }
    });
  }


}
