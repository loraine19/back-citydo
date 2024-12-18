import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Req } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { ProfileEntity } from './entities/profile.entity';
import { RequestWithUser } from 'src/auth/auth.entities/auth.entity';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) { }

  @Post()
  create(@Body() createProfileDto: CreateProfileDto) {
    return this.profilesService.create(createProfileDto);
  }

  @Get()
  async findAll() {
    const profiles = await this.profilesService.findAll()
    if (!profiles.length) throw new HttpException(`No profiles found.`, HttpStatus.NO_CONTENT);
    return profiles
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profilesService.findOne(+id);
  }

  @Get('mines')
  @ApiBearerAuth()
  @ApiOkResponse({ type: ProfileEntity })
  async getProfile(@Req() req: RequestWithUser) {
    const id = req.user.sub
    return this.profilesService.findOne(id)
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profilesService.update(+id, updateProfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profilesService.remove(+id);
  }
}
