import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
export const roundsOfHashing = 10;


//// SERVICE MAKE ACTION

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }


  async create(data: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(
      data.password,
      roundsOfHashing,
    );
    data.password = hashedPassword
    return this.prisma.user.create({
      data
    });
  }

  async findAll(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }

  async findOne(id: number): Promise<User> {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async update(id: number, user: UpdateUserDto): Promise<User> {
    if (user.password) {
      user.password = await bcrypt.hash(
        user.password,
        roundsOfHashing,
      );
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