import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, Query, DefaultValuePipe, Put } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'middleware/decorators';



const route = "messages"
@UseGuards(AuthGuard)
@Controller(route)
@ApiTags(route)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) { }

  @Post()
  create(@Body() createMessageDto: CreateMessageDto) {
    return this.messagesService.create(createMessageDto);
  }

  @Get()
  findAll(
    @User() userId: number,
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page?: number,
  ) {
    return this.messagesService.findAll(userId, page);
  }

  @Get('conversation/:id')
  findConversation(
    @User() userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page?: number,
  ) {
    return this.messagesService.findConversation(userId, id, page);
  }


  @Put('remove/:id')
  deleteMessage(
    @User() userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.messagesService.removeMessage(userId, id);

  }

  @Patch('readConverstaion/:id')
  readConversation(
    @Param('id', ParseIntPipe) id: number,
    @User() userId: number) {
    return this.messagesService.readConversation(userId, id)
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messagesService.remove(+id);
  }
}
