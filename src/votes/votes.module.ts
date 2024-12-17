import { Module } from '@nestjs/common';
import { VotesService } from './votes.service';
import { VotesController } from './votes.controller';
import { UsersService } from 'src/users/users.service';

@Module({
  controllers: [VotesController],
  providers: [VotesService, UsersService],
})
export class VotesModule { }
