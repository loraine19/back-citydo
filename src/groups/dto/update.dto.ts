import { PartialType } from '@nestjs/swagger';
import { CreateDto } from './create.dto';

export class UpdateDto extends PartialType(CreateDto) {}
