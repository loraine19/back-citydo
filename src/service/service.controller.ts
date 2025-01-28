import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Req, ParseIntPipe, UseInterceptors, UploadedFile, UseGuards, Put, Query } from '@nestjs/common';
import { ServicesService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ServiceEntity } from './entities/service.entity';
import { RequestWithUser } from 'src/auth/auth.entities/auth.entity';
import { parseData } from '../../middleware/BodyParser';
import { ImageInterceptor } from '../../middleware/ImageInterceptor';
import { AuthGuard } from '../auth/auth.guard';
import { Service, ServiceStep, $Enums } from '@prisma/client';
import { User } from 'middleware/decorators';
import { ServiceUpdate } from 'src/events/constant';


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
  @ApiConsumes('multipart/form-data')
  async create(@Body() data: CreateServiceDto, @UploadedFile() image: Express.Multer.File, @Req() req: RequestWithUser): Promise<Service> {
    const id = req.user.sub
    data.userId = id
    data = await parseData(data, image);
    return this.serviceService.create(data)
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: ServiceEntity })
  @ApiBody({ type: UpdateServiceDto })
  @UseInterceptors(ImageInterceptor.create('service'))
  @ApiConsumes('multipart/form-data', 'application/json')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @User() userId: number,
    @Body() data: UpdateServiceDto,
    @UploadedFile() image: Express.Multer.File,): Promise<Service> {
    const service = await this.serviceService.findOne(id, data.userId)
    service.image && image && ImageInterceptor.deleteImage(service.image)
    data = parseData(data, image)
    return this.serviceService.update(id, data)
  }


  @Put(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: ServiceEntity })
  async updateStep(
    @Param('id', ParseIntPipe) id: number,
    @User() userId: number,
    @Query('update') update: ServiceUpdate): Promise<Service> {
    switch (update) {
      case ServiceUpdate.FINISH:
        return this.serviceService.updateFinish(id, userId);
      case ServiceUpdate.POST_RESP:
        return this.serviceService.updatePostResp(id, userId);
      case ServiceUpdate.VALID_RESP:
        return this.serviceService.updateValidResp(id, userId);
      case ServiceUpdate.CANCEL_RESP:
        return this.serviceService.updateCancelResp(id, userId);
    }
  }


  @Get()
  @ApiBearerAuth()
  async findAll(
    @User() userId: number,
    @Query('page', ParseIntPipe) page?: number,
    @Query('mine') mine?: boolean,
    @Query('type') type?: $Enums.ServiceType,
    @Query('step') step?: $Enums.ServiceStep,
    @Query('category') category?: $Enums.ServiceCategory): Promise<{ services: Service[], count: number }> {
    console.log('mine', mine)
    if (mine) return this.serviceService.findAllByUser(userId, page, type, step, category);
    return this.serviceService.findAll(userId, page, type, step, category);
  }


  @Get(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: ServiceEntity })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @User() userId: number,): Promise<Service> {
    return this.serviceService.findOne(id, userId);
  }


  @Delete(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: ServiceEntity })
  remove(
    @Param('id', ParseIntPipe) id: number): Promise<Service> {
    return this.serviceService.remove(id);
  }
}
