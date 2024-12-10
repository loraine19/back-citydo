import { PrismaClient } from '@prisma/client';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Body, Injectable} from '@nestjs/common';
import { Group } from '@prisma/client';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service'
import { PrismaService } from 'src/prisma/prisma.service';

const prisma = new PrismaClient();

const initialUsers: CreateUserDto[] =  [
  {
    email: "utilisateur1@exemple.fr",
    password: "motdepassefort123",
  },
  {
    email: "utilisateur2@exemple.fr",
    password: "motdepassefort456",
  },
  {
    email: "utilisateur3@exemple.fr",
    password: "motdepassefort789",
  },
  {
    email: "utilisateur4@exemple.fr",
    password: "motdepassefort012",
  },
  {
    email: "utilisateur6@exemple.fr",
    password: "motdepassefort345",
  }
]


const seed = async () => {
  for (const user of initialUsers) {
    if (!await prisma.user.findUnique({ where: { email: user.email } })) { 
     await prisma.user.create({
      data: user,
    })}}
}
seed();