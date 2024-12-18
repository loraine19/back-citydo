import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Req, ParseIntPipe } from '@nestjs/common';
import { ServicesService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ApiBearerAuth, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ServiceEntity } from './entities/service.entity';
import { RequestWithUser } from 'src/auth/auth.entities/auth.entity';
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
  @ApiOkResponse({ type: ServiceEntity })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.serviceService.findOne(+id);
  }

  @Get('mines')
  @ApiBearerAuth()
  @ApiOkResponse({ type: ServiceEntity })
  async getMines(@Req() req: RequestWithUser) {
    const id = req.user.sub
    return this.serviceService.findSome(id)
  }

  @Patch(':id')
  @ApiOkResponse({ type: ServiceEntity })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateServiceDto: UpdateServiceDto) {
    return this.serviceService.update(+id, updateServiceDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: ServiceEntity })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.serviceService.remove(+id);
  }
}
