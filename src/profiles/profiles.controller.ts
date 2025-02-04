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
import { User } from 'middleware/decorators';
import { CreateAddressDto } from 'src/addresses/dto/create-address.dto';


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
  async create(
    @Body() data: any,
    @UploadedFile() image: Express.Multer.File,
    @User() userId: number): Promise<Profile> {
    console.log(data)
    data.userId = userId
    data = await parseData(data, image)
    console.log(34, data)
    return await this.profilesService.create(data)
  }

  @Patch()
  @ApiBearerAuth()
  @ApiOkResponse({ type: ProfileEntity })
  @ApiBody({ type: UpdateProfileDto })
  @UseInterceptors(ImageInterceptor.create('profiles'))
  @ApiConsumes('multipart/form-data')
  async update(
    @Body() data: UpdateProfileDto,
    @UploadedFile() image: Express.Multer.File,
    @User() userId: number): Promise<Profile> {
    const profileVerify = await this.profilesService.findOneByUserId(userId)
    if (profileVerify.image && image) {
      ImageInterceptor.deleteImage(profileVerify.image)
    }
    data = await parseData(data, image)
    return this.profilesService.update(data, userId);
  }


  @Get()
  @ApiBearerAuth()
  async findAll() {
    const profiles = await this.profilesService.findAll()
    if (!profiles.length) throw new HttpException(`No profiles found.`, HttpStatus.NO_CONTENT);
    return profiles
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOkResponse({ type: ProfileEntity })
  async findMine(@Req() req: RequestWithUser): Promise<Profile> {
    const id = req.user.sub
    return this.profilesService.findOneByUserId(id)
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
