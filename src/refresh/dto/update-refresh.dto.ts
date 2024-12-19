import { PartialType } from '@nestjs/swagger';
import { CreateRefreshDto } from './create-refresh.dto';

export class UpdateRefreshDto extends PartialType(CreateRefreshDto) {}
