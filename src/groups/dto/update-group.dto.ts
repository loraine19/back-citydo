import { PartialType } from '@nestjs/swagger';
import { CreateGroupDto } from './create-group.dto';
import { Group } from '../entities/group.entity';

export class UpdateGroupDto extends PartialType(Group) {}
