import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, ValidationPipe, NotFoundException, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { AddressEntity } from './entities/address.entity';
import { AuthGuard } from '../auth/auth.guard';
import { RequestWithUser } from 'src/auth/auth.entities/auth.entity';
import { Address } from '@prisma/client';
import { parseData } from '../../middleware/BodyParser';

const route = 'addresses'
@ApiTags(route)
@Controller(route)
@UseGuards(AuthGuard)
export class AddressController {
  constructor(private readonly addressService: AddressService) { }

  @Post()
  @ApiBearerAuth()
  @ApiOkResponse({ type: AddressEntity })
  create(@Body(new ValidationPipe()) data: CreateAddressDto): Promise<Address> {
    parseData(data)
    return this.addressService.create(data);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOkResponse({ type: AddressEntity, isArray: true })
  async findAll(): Promise<Address[]> {
    const address = await this.addressService.findAll()
    return address || [];
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: AddressEntity })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Address> {
    return await this.addressService.findOne(id)
  }


}