import { Module } from '@nestjs/common';
import { FlagsService } from './flags.service';
import { FlagsController } from './flags.controller';

@Module({
  controllers: [FlagsController],
  providers: [FlagsService],
})
export class FlagsModule {}
