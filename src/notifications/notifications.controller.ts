import { Controller, Get, Put, Param, UseGuards, ParseIntPipe, Query } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { User } from 'middleware/decorators';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { $Enums, Notification } from '@prisma/client';

const route = 'notifications'
@UseGuards(AuthGuard)
@Controller(route)
@ApiTags(route)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) { }

  @Get()
  async findAll(
    @User() userId: number,
    @Query('page', ParseIntPipe) page?: number,
    @Query('filter') filter?: $Enums.NotificationType): Promise<{ notifs: Notification[], count: number }> {
    return this.notificationsService.findAll(page, userId, filter);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @User() userId: number) {
    return this.notificationsService.findOne(id, userId);
  }


  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @User() userId: number) {
    return this.notificationsService.update(id, userId);
  }

}
