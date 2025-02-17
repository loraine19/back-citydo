import { Module } from '@nestjs/common';
import { FlagsService } from './flags.service';
import { FlagsController } from './flags.controller';
import { MailerService } from 'src/mailer/mailer.service';

@Module({
  controllers: [FlagsController],
  providers: [FlagsService, MailerService],
})
export class FlagsModule { }
