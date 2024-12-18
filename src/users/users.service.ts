import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma } from '@prisma/client';
import * as argon2 from 'argon2';
export const roundsOfHashing = 10;


//// SERVICE MAKE ACTION
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  //Prisma.UserCreateInput
  async create(data: CreateUserDto): Promise<User> {
    const user = { ...data };
    user.password = await argon2.hash(user.password);
    return await this.prisma.user.create({ data })
  }

  async findAll(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }


  async findOne(id: number): Promise<User> {
    return await this.prisma.user.findUniqueOrThrow({ where: { id } });
  }
  async findUnique(email: string): Promise<User> {
    return await this.prisma.user.findUniqueOrThrow({ where: { email: email } });
  }

  async update(id: number, user: UpdateUserDto): Promise<User> {
    if (user.password) {
      user.password = await argon2.hash(user.password);
    }
    return await this.prisma.user.update({
      where: { id },
      data: { ...user, password: user.password },
    });
  }

  async remove(id: number): Promise<User> {
    return await this.prisma.user.delete({ where: { id } });
  }
}