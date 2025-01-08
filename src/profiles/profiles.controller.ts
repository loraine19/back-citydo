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
  @ApiConsumes('multipart/form-data')
  async create(@Body() data: CreateProfileDto, @UploadedFile() image: Express.Multer.File, @Req() req: RequestWithUser): Promise<Profile> {
    try {
      console.log(data)
      data.userId = req.user.sub
      data = await parseData(data, image)
      return await this.profilesService.create(data)
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }


  @Patch()
  @ApiBearerAuth()
  @ApiOkResponse({ type: ProfileEntity })
  @ApiBody({ type: UpdateProfileDto })
  @UseInterceptors(ImageInterceptor.create('profiles'))
  @ApiConsumes('multipart/form-data')
  async update(@Body() data: UpdateProfileDto, @UploadedFile() image: Express.Multer.File, @Req() req: RequestWithUser): Promise<Profile> {
    console.log(data)
    data.userId = req.user.sub
    data = await parseData(data, image)
    return this.profilesService.update(data);
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
