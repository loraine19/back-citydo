import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, BadRequestException, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiCreatedResponse, ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


//// CONTROLLER DO ROUTE 
const route = 'users'
@Controller(route)
@ApiTags(route)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @ApiCreatedResponse({ type: UserEntity })
  //// FK ADDRESS   
  async create(@Body() data: CreateUserDto) {
    const unique = await this.usersService.findUnique(data.email)
    if (unique) return new BadRequestException(`user already exist`);
    const user = await this.usersService.create(data);
    if (!user) throw new BadRequestException(`no ${route} created`)
    return { user }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findAll() {
    const user = await this.usersService.findAll()
    if (!user) throw new NotFoundException(`no ${route} find`)
    return { user }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOne(+id)
    if (!user) throw new NotFoundException(`no ${id} find in ${route}`)
    return { user: new UserEntity(user) }

  }
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateUserDto) {
    const find = this.usersService.findOne(+id)
    const user = this.usersService.update(+id, data)
    if (!find) throw new NotFoundException(`no ${id} find in ${route}`)
    if (!user) throw new NotFoundException(`${route} ${id} not updated`)
    return { user };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  remove(@Param('id', ParseIntPipe) id: number) {
    const find = this.usersService.findOne(+id)
    const remove = this.usersService.remove(+id)
    const user = this.usersService.remove(+id)
    if (!find) throw new NotFoundException(`no ${id} find in ${route}`)
    if (!remove) throw new NotFoundException(`${route} ${id} not deleted`)
    return { user, message: `${route} ${id} deleted` };
  }
}
