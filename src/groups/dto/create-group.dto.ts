import { PartialType } from "@nestjs/swagger";
import { Group } from "../entities/group.entity";
export type CreateGroupDto= Omit<Group, 'id'>