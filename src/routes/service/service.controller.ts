import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { ServicesService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ServiceEntity } from './entities/service.entity';
const route = 'service'

@Controller(route)
@ApiTags(route)
export class ServicesController {
  constructor(private readonly serviceService: ServicesService) { }

  @Post()
  @ApiResponse({ type: ServiceEntity })
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.serviceService.create(createServiceDto);
  }

  @Get()
  @ApiResponse({ type: ServiceEntity, isArray: true })

  async findAll(): Promise<ServiceEntity[]> {
    const services = await this.serviceService.findAll();
    if (!services.length) throw new HttpException(`No ${route} found.`, HttpStatus.NO_CONTENT);
    return services;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviceService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.serviceService.update(+id, updateServiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.serviceService.remove(+id);
  }
}
