import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';


//// SERVICE MAKE ACTION

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  create(data: CreateUserDto):Promise<User> {
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

 async update(id: number, updateUserDto: UpdateUserDto):Promise<User> {
    return await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

 async remove(id: number):Promise<User> {
    return await this.prisma.user.delete({ where: { id } });
  }
}