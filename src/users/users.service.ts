import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma } from '@prisma/client';
import * as argon2 from 'argon2';


//// SERVICE MAKE ACTION
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  //Prisma.UserCreateInput
  async create(data: CreateUserDto): Promise<User> {
    let user = { ...data };
    const userFind = await this.prisma.user.findUnique({ where: { email: user.email } });
    if (userFind) throw new HttpException('User already exists', HttpStatus.CONFLICT);
    user.password = await argon2.hash(user.password);
    const createdUser = await this.prisma.user.create({ data: user });
    return createdUser;
  }

  async findAll(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }

  async findOne(id: number): Promise<User> {
    return await this.prisma.user.findUniqueOrThrow(
      {
        where: { id },
        include: {
          Profile: { include: { Address: true } },
        }
      });
  }
  async findUnique(email: string): Promise<User> {
    return await this.prisma.user.findUniqueOrThrow({ where: { email } });
  }

  async update(id: number, user: UpdateUserDto): Promise<User> {
    const existingUser = await this.prisma.user.findUniqueOrThrow({ where: { id } });
    if (!existingUser) { throw new NotFoundException(`User with id ${id} not found`) }
    if (user.password) { user.password = await argon2.hash(user.password); }
    return await this.prisma.user.update({
      where: { id },
      data: { ...user, password: user.password },
    });
  }

  async remove(id: number): Promise<User> {
    return await this.prisma.user.delete({ where: { id } });
  }
}