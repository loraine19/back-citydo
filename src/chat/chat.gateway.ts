import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsAuthGuard } from 'src/auth/auth.guard';
import { CreateMessageDto } from 'src/messages/dto/create-message.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@UseGuards(WsAuthGuard)
@WebSocketGateway({
  cors: {
    origin: [process.env.NEST_ENV !== 'dev' ? process.env.FRONT_URL : '*'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly prisma: PrismaService) { }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const userId = client.user;
    const { userIdRec, message } = data;
    console.log(`[SERVER] Received message from user ${userId} to user ${userIdRec} in data:`, data);

    if (!message || !userIdRec) {
      const errorMsg = 'Message is required';
      throw new WsException(errorMsg);
    }

    const newMessage = await this.prisma.message.create({ data: { message, userId, userIdRec } });
    const room = this.getRoomName(userId.toString(), userIdRec.toString());
    client.join(room);
    this.server.to(room).emit('newMessage', newMessage);
  }

  private getRoomName(userId1: string, userId2: string): string {
    const roomName = [userId1, userId2].sort().join('-');
    console.log(`[SERVER] Room name generated: ${roomName} from users ${userId1} and ${userId2}`);
    return roomName;
  }
}
