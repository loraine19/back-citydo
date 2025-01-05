import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, HttpException, HttpStatus, Req } from '@nestjs/common';
import { ApiCreatedResponse, ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { AuthGuard } from '../../src/auth/auth.guard';
import { RequestWithUser } from 'src/auth/auth.entities/auth.entity';
import { User } from '@prisma/client';


//// CONTROLLER DO ROUTE 
const route = 'users'
@Controller(route)
@ApiTags(route)
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @ApiCreatedResponse({ type: UserEntity })
  async create(@Body() data: CreateUserDto): Promise<User> {
    const user = await this.usersService.findUnique(data.email)
    return await this.usersService.create(data);
  }

  @Get()
  @ApiBearerAuth()
  async findAll(): Promise<User[]> {
    const users = await this.usersService.findAll()
    //  if (!users.length) throw new HttpException(`No ${route} found.`, HttpStatus.NO_CONTENT);
    return users
  }

  @Get('modos')
  @ApiBearerAuth()
  async findAllModo(@Req() req: RequestWithUser): Promise<Partial<User>[]> {
    const id = req.user.sub
    const users = await this.usersService.findAllModo(id)
    // if (!users.length) throw new HttpException(`No ${route} found.`, HttpStatus.NO_CONTENT);
    return users
  }



  @Get('me')
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  async FindMe(@Req() req: RequestWithUser): Promise<User> {
    const id = req.user.sub
    return this.usersService.findOne(id)
  }




  @Get(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.usersService.findOne(id)
  }


  @Patch(':id')
  @ApiBearerAuth()
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateUserDto): Promise<User> {
    return this.usersService.update(id, data)
  }

  @Delete(':id')
  @ApiBearerAuth()
  async remove(@Param('id', ParseIntPipe) id: number): Promise<User> {
    const user = await this.usersService.remove(+id)
    return user;
  }
}
