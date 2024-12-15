import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, BadRequestException, UseGuards, ParseIntPipe, HttpException } from '@nestjs/common';
import { ApiCreatedResponse, ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { JwtAuthGuard } from 'src/routes/auth/jwt-auth.guard';


//// CONTROLLER DO ROUTE 
const route = 'users'
@Controller(route)
@ApiTags(route)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @ApiCreatedResponse({ type: UserEntity })
  async create(@Body() data: CreateUserDto) {
    const user = await this.usersService.findUnique(data.email)
    return await this.usersService.create(data);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async findAll() {
    const users = await this.usersService.findAll()
    if (!users.length) throw new HttpException(`No ${route} found.`, 204);
    return users
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(+id)
  }


  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateUserDto) {
    return this.usersService.update(+id, data)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async remove(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.remove(+id)
    return { user, message: `${route} ${id} deleted` };
  }
}
