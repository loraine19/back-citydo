import { Module } from '@nestjs/common';
import { PoolsService } from './pools.service';
import { PoolsController } from './pools.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { VotesService } from '../votes/votes.service';

@Module({
  imports: [PrismaModule],
  controllers: [PoolsController],
  providers: [PoolsService, VotesService],
})
export class PoolsModule { }
