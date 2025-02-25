import { PartialType } from '@nestjs/swagger';
import { CreatePoolDto } from './create-pool.dto';

export class UpdatePoolDto extends PartialType(CreatePoolDto) {}
