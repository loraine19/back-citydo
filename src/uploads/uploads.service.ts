import { Injectable } from '@nestjs/common';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UploadsService {
  constructor(private prisma: PrismaService) { }
  async create(file: any) {
    file = { ...file, filename: file.originalname, mimetype: file.mimetype }
    const fileData = {
      originalname: file.filename,
      path: process.env.STORAGE + file.path.replace('dist', ''),
      mimeType: file.mimetype,
    }
    return await this.prisma.file.create({ data: fileData });
  }


  findAll() {
    return `This action returns all uploads`;
  }

  findOne(id: number) {
    return `This action returns a #${id} upload`;
  }

  update(id: number, updateUploadDto: UpdateUploadDto) {
    return `This action updates a #${id} upload`;
  }

  remove(id: number) {
    return `This action removes a #${id} upload`;
  }
}
