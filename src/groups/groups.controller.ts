import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, ValidationPipe, NotFoundException, ParseIntPipe, BadRequestException } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GroupEntity } from './entities/group.entity';
import { GroupsService } from './groups.service';
import { AddressService } from 'src/address/address.service';

//// CONTROLLER DO ROUTE 
const route = 'groups'
@Controller(route)
@ApiTags(route)
export class GroupsController {
  constructor(private readonly service: GroupsService, readonly addressService: AddressService) { }

  @Post()
  @ApiOkResponse({ type: GroupEntity })
  async create(@Body(new ValidationPipe()) data: CreateGroupDto) {
    return this.service.create(data);
  }

  @Get()
  @ApiOkResponse({ type: GroupEntity, isArray: true })
  async findAll() {
    const groups = await this.service.findAll()
    if (!groups.length) throw new HttpException(`No ${route} found.`, HttpStatus.NO_CONTENT);
    return groups;
  }

  @Get(':id')
  @ApiOkResponse({ type: GroupEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(+id)
  }

  @Get(':id/users')
  @ApiOkResponse({ type: GroupEntity })
  async findOneUsers(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOneUsers(+id)
  }


  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateGroupDto) {
    return this.service.update(id, data)
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id)

  }
}
