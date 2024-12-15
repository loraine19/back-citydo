import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, ValidationPipe, NotFoundException, ParseIntPipe, BadRequestException } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GroupEntity } from './entities/group.entity';
import { GroupsService } from './groups.service';
import { AddressService } from 'src/routes/address/address.service';

//// CONTROLLER DO ROUTE 
const route = 'groups'
@Controller(route)
@ApiTags(route)
export class GroupsController {
  constructor(private readonly service: GroupsService, readonly addressService: AddressService) { }

  @Post()
  @ApiOkResponse({ type: GroupEntity })
  /// FK ADDRESS
  create(@Body(new ValidationPipe()) data: CreateGroupDto) {
    const address = this.addressService.findOne(data.addressId)
    if (!address) throw new BadRequestException(`no ${data.addressId} find in address`)
    const group = this.service.create(data);
    if (!group) throw new NotFoundException(`no ${route} created`)
    return { group };
  }

  @Get()
  @ApiOkResponse({ type: GroupEntity, isArray: true })
  async findAll() {
    const group = await this.service.findAll()
    if (!group) throw new NotFoundException(`no ${route} find`)
    return { group };
  }

  @Get(':id')
  @ApiOkResponse({ type: GroupEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const group = await this.service.findOne(+id)
    if (!group) throw new NotFoundException(`no ${id} find in ${route}`)
    return { group };
  }

  @Get(':id/users')
  @ApiOkResponse({ type: GroupEntity })
  async findOneUsers(@Param('id', ParseIntPipe) id: number) {
    const group = await this.service.findOneUsers(+id)
    if (!group) throw new NotFoundException(`no ${id} find in ${route}`)
    return { group };
  }


  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateGroupDto) {
    const find = this.service.findOne(+id)
    if (!find) throw new BadRequestException(`no ${id} find in ${route}`)
    const group = this.service.update(+id, data)
    if (!group) throw new NotFoundException(`${route} ${id} not updated`)
    return { group };
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    const find = this.service.findOne(+id)
    if (!find) throw new BadRequestException(`no ${id} find in ${route}`)
    const group = this.service.remove(+id)
    if (!group) throw new NotFoundException(`${route} ${id} not deleted`)
    return { group, message: `${route} ${id} deleted` };
  }
}
