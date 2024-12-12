import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PrismaFilter } from './prisma-client-exception.filter';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule { }



