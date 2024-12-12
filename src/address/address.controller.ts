import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, ValidationPipe, NotFoundException, ParseIntPipe, BadRequestException } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { Entity } from 'src/participants/entities/participant.entity';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';


const route = 'address'
@Controller(route)
export class AddressController {
  constructor(private readonly service: AddressService) { }

  @Post()
  create(@Body(new ValidationPipe()) data: CreateAddressDto) {
    const address = this.service.create(data);
    if (!address) throw new NotFoundException(`no ${route} created`)
    return { address };
  }

  @Get()
  async findAll() {
    const address = await this.service.findAll()
    if (!address) throw new NotFoundException(`no ${route} find`)
    return { address };
  }

  @Get(':id')
  @ApiOkResponse({ type: Entity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const address = await this.service.findOne(+id)
    if (!address) throw new NotFoundException(`no ${id} find in ${route}`)
    return { address };

  }
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateAddressDto) {
    const find = this.service.findOne(+id)
    const address = this.service.update(+id, data)
    if (!find) throw new BadRequestException(`no ${id} find in ${route}`)
    if (!address) throw new NotFoundException(`${route} ${id} not updated`)
    return { address };
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    const find = this.service.findOne(+id)
    if (!find) throw new BadRequestException(`no ${id} find in ${route}`)
    const address = this.service.remove(+id)
    if (!address) throw new NotFoundException(`${route} ${id} not deleted`)
    return { address, message: `${route} ${id} deleted` };
  }
}