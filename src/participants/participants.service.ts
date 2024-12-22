import { Injectable } from '@nestjs/common';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Participant } from '@prisma/client';


//// SERVICE MAKE ACTION

@Injectable()
export class ParticipantsService {
  constructor(private prisma: PrismaService) { }
  async create(data: CreateParticipantDto): Promise<Participant> {
    const { userId, eventId } = data;
    return await this.prisma.participant.create({
      data: {
        User: { connect: { id: userId } },
        Event: { connect: { id: eventId } },
      },
    });
  }

  async findAll(): Promise<Participant[]> {
    return await this.prisma.participant.findMany();
  }

  async findOne(userId: number, eventId: number): Promise<Participant> {
    return await this.prisma.participant.findUniqueOrThrow({
      where: { userId_eventId: { userId, eventId } }
    });
  }

  async update(userId: number, eventId: number, updatePartcicipantDto: UpdateParticipantDto): Promise<Participant> {
    return await this.prisma.participant.update({
      where: { userId_eventId: { userId, eventId } },
      data: updatePartcicipantDto,
    });
  }

  async remove(userId: number, eventId: number): Promise<Participant> {
    return await this.prisma.participant.delete({ where: { userId_eventId: { userId, eventId } }, });
  }
}