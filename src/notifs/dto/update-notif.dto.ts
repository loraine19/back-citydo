import { PartialType } from '@nestjs/swagger';
import { CreateNotifDto } from './create-notif.dto';

export class UpdateNotifDto extends PartialType(CreateNotifDto) {}
