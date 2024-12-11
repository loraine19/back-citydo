import { Module } from '@nestjs/common';
import { EventService } from './service';
import { EventController } from './controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
