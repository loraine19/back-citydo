import { Module } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { UploadsModule } from 'src/uploads/uploads.module';
import { UploadsController } from 'src/uploads/uploads.controller';
import { UploadsService } from '../uploads/uploads.service';

@Module({
  controllers: [ProfilesController,],
  providers: [ProfilesService],
})
export class ProfilesModule { }
