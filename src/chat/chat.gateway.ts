import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsAuthGuard } from 'src/auth/auth.guard';
import { CreateMessageDto } from 'src/messages/dto/create-message.dto';
import { MessagesService } from 'src/messages/messages.service';

const WS = 'chat';

@UseGuards(WsAuthGuard)
@WebSocketGateway({
  namespace: '/' + WS,
  cors: {
    origin: [process.env.NEST_ENV !== 'dev' ? process.env.FRONT_URL : '*'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  private users: number[] = [];
  constructor(private readonly messagesService: MessagesService) { }

  @SubscribeMessage(`${WS}-message`)
  async handleMessage(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const userId = client.user
    const { userIdRec, message } = data;

    if (!this.users.includes(userId)) {
      this.users.push(userId);
      this.server.emit(`${WS}-message`, { users: this.users });
    }

    client.on('disconnect', () => {
      this.users = this.users.filter(user => user !== userId);
      this.server.emit(`${WS}-message`, { users: this.users });
    });

    const room = this.getRoomName(userId);
    client.join(room);

    if (userIdRec) {
      const newMessage = await this.messagesService.create({ userId, userIdRec, message });
      const recRoom = this.getRoomName(userIdRec);
      this.server.to(recRoom).emit(`${WS}-message`, newMessage);
      this.server.to(room).emit(`${WS}-message`, newMessage);
    } else {
      this.server.to(room).emit(`${WS}-message`, message);
    }
  }

  private getRoomName(id: number): string {
    return `${id.toString()}-${WS}`;
  }

}
