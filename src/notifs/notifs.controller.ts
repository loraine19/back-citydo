import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { NotifsService } from './notifs.service';
import { CreateNotifDto } from './dto/create-notif.dto';
import { UpdateNotifDto } from './dto/update-notif.dto';
import { RequestWithUser } from 'src/auth/auth.entities/auth.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';


const route = "notifs"
@UseGuards(AuthGuard)
@Controller(route)
@ApiTags(route)
export class NotifsController {
  constructor(private readonly notifsService: NotifsService) { }

  @Get()
  @ApiBearerAuth()
  // @ApiResponse()
  async findAll(@Req() req: RequestWithUser): Promise<any[]> {
    const id = req.user.sub;
    const notifs = await this.notifsService.findAllByUserId(id);
    return notifs
  }
}
