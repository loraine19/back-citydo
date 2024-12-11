import { Injectable } from '@nestjs/common';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';


//// SERVICE MAKE ACTION

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  create(data: CreateDto):Promise<User> {
    return this.prisma.user.create({
      data
    });
  }

 async findAll() : Promise<User[]> {
    return await this.prisma.user.findMany();
  }

 async findOne(id: number): Promise<User> {
    return await this.prisma.user.findUnique({ where: { id } });
  }

 async update(id: number, updateDto: UpdateDto):Promise<User> {
    return await this.prisma.user.update({
      where: { id },
      data: updateDto,
    });
  }

 async remove(id: number):Promise<User> {
    return await this.prisma.user.delete({ where: { id } });
  }
}