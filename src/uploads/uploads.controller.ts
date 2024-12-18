import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, UploadedFile, UseInterceptors, Injectable } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { UploadsService } from './uploads.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('files')
@ApiTags('files')

export class UploadsController {
  constructor(public readonly UploadsServices: UploadsService, private prisma: PrismaService) { }
  @Post('upload')
  @UseInterceptors(FileInterceptor('file',
    {
      storage: diskStorage({
        destination: './dist/public/images',
        filename: (req, file, cb) => cb(null, file.fieldname + '-' + Date.now().toString() + '.' + file.mimetype.split('/')[1])
      }),
      preservePath: true, limits: { fileSize: 1024 * 1024 * 5 }
    }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } })
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return await this.UploadsServices.create(file);
  }
}