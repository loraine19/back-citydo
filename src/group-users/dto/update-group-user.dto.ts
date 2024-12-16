import { PartialType } from '@nestjs/swagger';
import { CreateGroupUserDto } from './create-group-user.dto';

export class UpdateGroupUserDto extends PartialType(CreateGroupUserDto) {}
