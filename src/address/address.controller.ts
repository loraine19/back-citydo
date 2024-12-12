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
    return this.service.create(data);
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
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateAddressDto) {
    return this.service.update(+id, data)

  }

  @Delete(':id')
  @ApiOkResponse({ type: AddressEntity })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const address = this.service.remove(+id)
    return { address, message: `${route} ${id} deleted` };
  }
}