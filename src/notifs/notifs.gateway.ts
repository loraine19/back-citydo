import { UseGuards } from '@nestjs/common';
import { EventEmitter } from 'events';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsAuthGuard } from 'src/auth/auth.guard';

const WS = 'notifs'
@UseGuards(WsAuthGuard)
@WebSocketGateway({
  namespace: '/' + WS,
  cors: {
    origin: [process.env.NEST_ENV !== 'dev' ? process.env.FRONT_URL : '*'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class NotifsGateway {
  @WebSocketServer()
  server: Server;
  private users: number[] = [];
  constructor() {
    EventEmitter.defaultMaxListeners = 90; // Increase the limit
  }

  @SubscribeMessage(`${WS}-message`)
  async handleMessage(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const userId = client.user;

    if (!this.users.includes(userId)) {
      this.users.push(userId);
      this.server.emit(`${WS}-message`, { users: this.users })
    }

    client.on('disconnect', () => {
      this.users = this.users.filter(user => user !== userId);
      this.server.emit(`${WS}-message`, { users: this.users });
    });

    const room = this.getRoomName(userId.toString());
    client.join(room);
    this.server.to(room).emit(`${WS}-message`, `${WS}-message`);
  }

  private getRoomName(userId: string): string {
    const roomName = `${userId}-${WS}`
    return roomName;
  }

  sendNotificationToUser(userId: string, notification: any) {
    const room = this.getRoomName(userId.toString());
    console.log('sendNotificationToUser', room, notification);
    this.server.to(room).emit(`${WS}-message`, notification);
  }
}
