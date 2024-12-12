import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, ValidationPipe, NotFoundException, ParseIntPipe, BadRequestException } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { AddressEntity } from './entities/address.entity';


const route = 'address'
@Controller(route)
export class AddressController {
  constructor(private readonly service: AddressService) { }

  @Post()
  @ApiOkResponse({ type: AddressEntity })
  create(@Body(new ValidationPipe()) data: CreateAddressDto) {
    const address = this.service.create(data);
    if (!address) throw new NotFoundException(`no ${route} created`)
    return { address };
  }

  @Get()
  @ApiOkResponse({ type: AddressEntity, isArray: true })
  async findAll() {
    const address = await this.service.findAll()
    if (!address) throw new NotFoundException(`no ${route} find`)
    return { address };
  }

  @Get(':id')
  @ApiOkResponse({ type: AddressEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const address = await this.service.findOne(+id)
    if (!address) throw new NotFoundException(`no ${id} find in ${route}`)
    return { address };

  }

  @Get(':id&users')
  @ApiOkResponse({ type: AddressEntity })
  async findOneUsers(@Param('id', ParseIntPipe) id: number) {
    const address = await this.service.findOneUsers(+id)
    if (!address) throw new NotFoundException(`no ${id} find in ${route}`)
    return { address };
  }


  @Patch(':id')
  @ApiOkResponse({ type: AddressEntity })
  update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateAddressDto) {
    const find = this.service.findOne(+id)
    const address = this.service.update(+id, data)
    if (!find) throw new BadRequestException(`no ${id} find in ${route}`)
    if (!address) throw new NotFoundException(`${route} ${id} not updated`)
    return { address };
  }

  @Delete(':id')
  @ApiOkResponse({ type: AddressEntity })
  remove(@Param('id', ParseIntPipe) id: number) {
    const find = this.service.findOne(+id)
    if (!find) throw new BadRequestException(`no ${id} find in ${route}`)
    const address = this.service.remove(+id)
    if (!address) throw new NotFoundException(`${route} ${id} not deleted`)
    return { address, message: `${route} ${id} deleted` };
  }
}