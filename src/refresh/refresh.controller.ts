import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RefreshService } from './refresh.service';
import { CreateRefreshDto } from './dto/create-refresh.dto';
import { UpdateRefreshDto } from './dto/update-refresh.dto';

@Controller('refresh')
export class RefreshController {
  constructor(private readonly refreshService: RefreshService) {}

  @Post()
  create(@Body() createRefreshDto: CreateRefreshDto) {
    return this.refreshService.create(createRefreshDto);
  }

  @Get()
  findAll() {
    return this.refreshService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.refreshService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRefreshDto: UpdateRefreshDto) {
    return this.refreshService.update(+id, updateRefreshDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.refreshService.remove(+id);
  }
}
