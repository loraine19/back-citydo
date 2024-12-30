import { PartialType } from '@nestjs/swagger';
import { CreateFlagDto } from './create-flag.dto';

export class UpdateFlagDto extends PartialType(CreateFlagDto) {}
