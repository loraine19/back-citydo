import { Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { PrismaService } from 'src/prisma/prisma.service';


//// SERVICE MAKE ACTION
@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) {}
  create(createGroupDto: any) {
    return this.prisma.group.create({
     data: createGroupDto,
    });
  }
   

 async findAll() {
    return this.prisma.group.findMany();
  }

  findOne(id: number) {
    return this.prisma.group.findUnique({ where: { id } });
  }

  update(id: number, updateGroupDto: any) {
    return this.prisma.group.update({
      where: { id },
      data: updateGroupDto,
    });
  }

  remove(id: number) {
    return this.prisma.group.delete({ where: { id } });
  }
}
