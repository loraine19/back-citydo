import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, ValidationPipe, NotFoundException, ParseIntPipe, UseGuards, Req, } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GroupEntity } from './entities/group.entity';
import { GroupsService } from '../groups/groups.service';
import { AddressService } from '../addresses/address.service';
import { AuthGuard } from '../../src/auth/auth.guard';
import { RequestWithUser } from 'src/auth/auth.entities/auth.entity';
import { Group } from '@prisma/client';

//// CONTROLLER DO ROUTE 
const route = 'groups'
@Controller(route)
@ApiTags(route)
@UseGuards(AuthGuard)
export class GroupsController {
  constructor(private readonly groupsService: GroupsService, readonly addressService: AddressService) { }

  @Post()
  @ApiBearerAuth()
  @ApiOkResponse({ type: GroupEntity })
  async create(@Body(new ValidationPipe()) data: CreateGroupDto): Promise<Group> {
    return this.groupsService.create(data);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOkResponse({ type: GroupEntity, isArray: true })
  async findAll(): Promise<Group[]> {
    const groups = await this.groupsService.findAll()
    if (!groups.length) throw new HttpException(`No ${route} found.`, HttpStatus.NO_CONTENT);
    return groups;
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: GroupEntity })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Group> {
    return this.groupsService.findOne(id)
  }

  @Get('mines')
  @ApiBearerAuth()
  @ApiOkResponse({ type: GroupEntity, isArray: true })
  async findMine(@Req() req: RequestWithUser): Promise<Group[]> {
    const id = req.user.sub
    return this.groupsService.findAllByUserId(id)
  }

  @Get('/user/:id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: GroupEntity, isArray: true })
  async findAllByUserId(@Param('id', ParseIntPipe) id: number): Promise<Group[]> {
    return this.groupsService.findAllByUserId(id)
  }

  @Patch(':id')
  @ApiBearerAuth()
  update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateGroupDto): Promise<Group> {
    return this.groupsService.update(id, data)
  }

  @Delete(':id')
  @ApiBearerAuth()
  remove(@Param('id', ParseIntPipe) id: number): Promise<Group> {
    return this.groupsService.remove(id)
  }
}


