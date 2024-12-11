import { Module } from '@nestjs/common';
import { GroupsService } from './service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { GroupsController } from './controller';

@Module({
  imports: [PrismaModule],
  controllers: [GroupsController],
  providers: [GroupsService],
})
export class GroupsModule {}
