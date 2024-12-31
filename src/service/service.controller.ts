import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Req, ParseIntPipe, UseInterceptors, UploadedFile, UseGuards, Put } from '@nestjs/common';
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


  @Put('userResp/:id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: ServiceEntity })
  @ApiBody({ type: UpdateServiceDto })
  async updateUserResp(@Param('id', ParseIntPipe) id: number, @Body() data: { userIdResp: number }): Promise<Service> {
    return this.serviceService.updateUserResp(id, data);
  }

  @Put('validUserResp/:id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: ServiceEntity })
  @ApiBody({ type: UpdateServiceDto })
  async updateValidUserResp(@Param('id', ParseIntPipe) id: number, @Body() data: { userIdResp: number }, @Req() req: RequestWithUser): Promise<Service> {
    const updateData = { ...data, userId: req.user.sub }
    return this.serviceService.updateValidUserResp(id, updateData);
  }

  @Put('finish/:id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: ServiceEntity })
  @ApiBody({ type: UpdateServiceDto })
  async updateFinish(@Param('id', ParseIntPipe) id: number, @Req() req: RequestWithUser): Promise<Service> {
    const userId = req.user.sub
    return this.serviceService.updateFinish(id, userId);
  }




  @Get()
  @ApiBearerAuth()
  @ApiResponse({ type: ServiceEntity, isArray: true })
  async findAll(): Promise<Service[]> {
    const services = await this.serviceService.findAll();
    return services;
  }

  @Get('get')
  @ApiBearerAuth()
  @ApiResponse({ type: ServiceEntity, isArray: true })
  async findAllGet(): Promise<Service[]> {
    const services = await this.serviceService.findAllGet();
    return services;
  }

  @Get('do')
  @ApiBearerAuth()
  @ApiResponse({ type: ServiceEntity, isArray: true })
  async findAllDo(): Promise<Service[]> {
    const services = await this.serviceService.findAllDo();
    return services;
  }

  @Get('imin')
  @ApiBearerAuth()
  @ApiOkResponse({ type: ServiceEntity })
  async findImIn(@Req() req: RequestWithUser): Promise<Service[]> {
    const id = req.user.sub
    return this.serviceService.findAllByUser(id)
  }

  @Get('imin/get')
  @ApiBearerAuth()
  @ApiOkResponse({ type: ServiceEntity })
  async findImInGet(@Req() req: RequestWithUser): Promise<Service[]> {
    const id = req.user.sub
    return this.serviceService.findAllByUserGet(id)
  }

  @Get('imin/do')
  @ApiBearerAuth()
  @ApiOkResponse({ type: ServiceEntity })
  async findImInDo(@Req() req: RequestWithUser): Promise<Service[]> {
    const id = req.user.sub
    return this.serviceService.findAllByUserDo(id)
  }

  @Get('mines')
  @ApiBearerAuth()
  @ApiOkResponse({ type: ServiceEntity })
  async findMines(@Req() req: RequestWithUser): Promise<Service[]> {
    const id = req.user.sub
    return this.serviceService.findAllByUserId(id)
  }

  @Get('iresp')
  @ApiBearerAuth()
  @ApiOkResponse({ type: ServiceEntity })
  async findIResp(@Req() req: RequestWithUser): Promise<Service[]> {
    const id = req.user.sub
    return this.serviceService.findAllByUserRespId(id)
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

  @Get('resp/:id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: ServiceEntity })
  async findAllByUserRespId(@Param('id', ParseIntPipe) id: number): Promise<Service[]> {
    return this.serviceService.findAllByUserRespId(id)
  }




  @Delete(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: ServiceEntity })
  remove(@Param('id', ParseIntPipe) id: number): Promise<Service> {
    return this.serviceService.remove(+id);
  }
}
