import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, ValidationPipe, NotFoundException, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { AddressEntity } from './entities/address.entity';
import { AuthGuard } from '../../src/auth/auth.guard';

const route = 'address'
ApiTags(route)
@Controller(route)
@UseGuards(AuthGuard)
export class AddressController {
  constructor(private readonly addressService: AddressService) { }

  @Post()
  @ApiOkResponse({ type: AddressEntity })
  create(@Body(new ValidationPipe()) data: CreateAddressDto) {
    return this.addressService.create(data);
  }

  @Get()
  @ApiOkResponse({ type: AddressEntity, isArray: true })
  async findAll() {
    const address = await this.addressService.findAll()
    if (!address.length) throw new HttpException(`No ${route} found.`, HttpStatus.NO_CONTENT);
    return address;
  }

  @Get(':id')
  @ApiOkResponse({ type: AddressEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.addressService.findOne(+id);
    } catch (error) {
      throw new NotFoundException(`Address with id ${id} not found`);
    }
  }

  @Get(':id/with-users')
  @ApiOkResponse({ type: AddressEntity })
  async findOneUsers(@Param('id', ParseIntPipe) id: number) {
    return this.addressService.findOneUsers(+id)
  }


  @Patch(':id')
  @ApiOkResponse({ type: AddressEntity })
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateAddressDto) {
    return this.addressService.update(+id, data)

  }

  @Delete(':id')
  @ApiOkResponse({ type: AddressEntity })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.addressService.remove(+id);
    return { message: `${route} ${id} deleted` };
  }
}