import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Req, UseGuards, UploadedFile, UseInterceptors, ParseIntPipe } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ProfileEntity } from './entities/profile.entity';
import { RequestWithUser } from '../auth/auth.entities/auth.entity';
import { AuthGuard } from '../auth/auth.guard';
import { parseData } from '../../middleware/BodyParser';
import { ImageInterceptor } from '../../middleware/ImageInterceptor';
import { Profile } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';


const route = 'profiles'
@Controller(route)
@ApiTags(route)
@UseGuards(AuthGuard)
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) { }

  @Post()
  @ApiBearerAuth()
  @ApiOkResponse({ type: ProfileEntity })
  @ApiBody({ type: CreateProfileDto })
  @UseInterceptors(ImageInterceptor.create('profiles'))
  @ApiConsumes('multipart/form-data', 'application/json')
  async create(@Body() data: CreateProfileDto, @UploadedFile() image: Express.Multer.File,): Promise<Profile> {
    parseData(data)
    data = await parseData(data, image)
    console.log(data)
    return this.profilesService.create(data)
  }


  @Patch(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: ProfileEntity })
  @ApiBody({ type: UpdateProfileDto })
  @UseInterceptors(ImageInterceptor.create('profiles'))
  @ApiConsumes('multipart/form-data')
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: any, @UploadedFile() image: Express.Multer.File)
    : Promise<Profile> {
    image && (data.image = image)
    data = await parseData(data, data.image)
    console.log('converted data', data)
    return this.profilesService.update(id, data);
  }

  @Get()
  @ApiBearerAuth()
  async findAll() {
    const profiles = await this.profilesService.findAll()
    if (!profiles.length) throw new HttpException(`No profiles found.`, HttpStatus.NO_CONTENT);
    return profiles
  }

  @Get('mines')
  @ApiBearerAuth()
  @ApiOkResponse({ type: ProfileEntity })
  async findMine(@Req() req: RequestWithUser): Promise<Profile> {
    const id = req.user.sub
    return this.profilesService.findOneByUserId(id)
  }

  @Get('user/:userId')
  @ApiBearerAuth()
  @ApiOkResponse({ type: ProfileEntity })
  async findOneByUserId(@Param('userId', ParseIntPipe) userId: number): Promise<Profile> {
    return this.profilesService.findOneByUserId(userId)
  }


  @Get(':id')
  @ApiBearerAuth()
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Profile> {
    return this.profilesService.findOne(id);
  }


  @Delete(':id')
  @ApiBearerAuth()
  remove(@Param('id', ParseIntPipe) id: number): Promise<Profile> {
    return this.profilesService.remove(id);
  }
}
