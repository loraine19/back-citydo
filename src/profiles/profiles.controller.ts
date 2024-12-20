import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Req, UseGuards, UploadedFile, UseInterceptors, ParseIntPipe } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOkResponse } from '@nestjs/swagger';
import { ProfileEntity } from './entities/profile.entity';
import { RequestWithUser } from 'src/auth/auth.entities/auth.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { parseData } from 'middleware/BodyParser';
import { ImageInterceptor } from 'middleware/ImageInterceptor';


@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) { }

  @Post()
  @ApiOkResponse({ type: ProfileEntity })
  @ApiBody({ type: CreateProfileDto })
  @UseInterceptors(ImageInterceptor.create('profiles'))
  @ApiConsumes('multipart/form-data')
  async create(@Body() data: CreateProfileDto, @UploadedFile() image: Express.Multer.File,) {
    parseData(data)
    data = await parseData(data, image)
    return this.profilesService.create(data)
  }


  @Patch(':id')
  @ApiOkResponse({ type: ProfileEntity })
  @ApiBody({ type: UpdateProfileDto })
  @UseInterceptors(ImageInterceptor.create('profiles'))
  @ApiConsumes('multipart/form-data')
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateProfileDto, @UploadedFile() image: Express.Multer.File,) {
    parseData(data)
    data = await parseData(data, image)
    return this.profilesService.update(id, data);
  }

  @Get()
  async findAll() {
    const profiles = await this.profilesService.findAll()
    console.log(profiles)
    if (!profiles.length) throw new HttpException(`No profiles found.`, HttpStatus.NO_CONTENT);
    return profiles
  }
  @Get('mines')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: ProfileEntity })
  async findProfile(@Req() req: RequestWithUser) {
    const id = req.user.sub
    return this.profilesService.findOne(+id)
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profilesService.findOne(+id);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profilesService.remove(+id);
  }
}
