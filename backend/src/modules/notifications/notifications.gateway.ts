import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token =
        (client.handshake.auth?.token as string | undefined) ||
        client.handshake.headers?.authorization?.split(' ')[1];
      if (!token) {
        throw new Error('No token provided');
      }

      const secret = this.configService.get<string>('JWT_SECRET');
      const payload = await this.jwtService.verifyAsync<{
        sub?: string;
        id?: string;
      }>(token, { secret });

      const userId = payload.sub || payload.id;

      if (!userId) {
        throw new Error('Invalid token payload');
      }

      // Automatically join the authenticated user's room
      void client.join(userId);
      console.log(
        `Client authenticated and joined room ${userId}: ${client.id}`,
      );
    } catch (error) {
      console.log(
        `Client failed authentication: ${client.id} - ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // Remove the old unauthenticated 'join' handler completely.
  // Clients shouldn't be able to manually join arbitrary rooms.

  sendNotificationToUser(
    userId: string,
    notification: Record<string, unknown>,
  ) {
    this.server.to(userId).emit('new-notification', notification);
  }
}
