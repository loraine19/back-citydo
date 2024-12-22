import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Req, ParseIntPipe, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { ServicesService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ServiceEntity } from './entities/service.entity';
import { RequestWithUser } from 'src/auth/auth.entities/auth.entity';
import { parseData } from '../../middleware/BodyParser';
import { ImageInterceptor } from '../../middleware/ImageInterceptor';
import { AuthGuard } from '../auth/auth.guard';
import { Service } from '@prisma/client';


const route = 'services'

@UseGuards(AuthGuard)
@Controller(route)
@ApiTags(route)
export class ServicesController {
  constructor(private readonly serviceService: ServicesService) { }

  @Post()
  @ApiBearerAuth()
  @ApiOkResponse({ type: ServiceEntity })
  @ApiBody({ type: CreateServiceDto })
  @UseInterceptors(ImageInterceptor.create('service'))
  @ApiConsumes('multipart/form-data', 'application/json')
  async create(@Body() data: CreateServiceDto, @UploadedFile() image: Express.Multer.File,): Promise<Service> {
    data = await parseData(data, image)
    return this.serviceService.create(data)
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: ServiceEntity })
  @ApiBody({ type: UpdateServiceDto })
  @UseInterceptors(ImageInterceptor.create('survey'))
  @ApiConsumes('multipart/form-data', 'application/json')
  update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateServiceDto, @UploadedFile() image: Express.Multer.File,): Promise<Service> {
    data = parseData(data, image)
    return this.serviceService.update(id, data);
  }

  @Get()
  @ApiBearerAuth()
  @ApiResponse({ type: ServiceEntity, isArray: true })

  async findAll(): Promise<Service[]> {
    const services = await this.serviceService.findAll();
    if (!services.length) throw new HttpException(`No ${route} found.`, HttpStatus.NO_CONTENT);
    return services;
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: ServiceEntity })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Service> {
    return this.serviceService.findOne(id);
  }


  @Get('user/:id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: ServiceEntity })
  async findAllByUserId(@Param('id', ParseIntPipe) id: number): Promise<Service[]> {
    return this.serviceService.findAllByUserId(id)
  }

  @Get('mines')
  @ApiBearerAuth()
  @ApiOkResponse({ type: ServiceEntity })
  async findMines(@Req() req: RequestWithUser): Promise<Service[]> {
    const id = req.user.sub
    return this.serviceService.findAllByUserId(id)
  }


  @Delete(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: ServiceEntity })
  remove(@Param('id', ParseIntPipe) id: number): Promise<Service> {
    return this.serviceService.remove(+id);
  }
}
