import { Logger, UnauthorizedException, UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WsResponse
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { TokenService } from './auth/token.service';
import { WebsocketAuthGuard } from './auth/websocket-auth.guard';
import { JobPostStateService } from './job-post/job-post-state.service';
import { UserEntity } from './user/entities/user.entity';
import { UserService } from './user/user.service';

// NOTE: AuthGuard does not affect handleConnection, ie: have to handle auth logic in handlConnection
// AuthGuard will protect all the @SubscribeMessage
@UseGuards(WebsocketAuthGuard)
@WebSocketGateway()
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger: Logger = new Logger('AppGateway');

  private readonly connectedSockets = new Map<string, Socket[]>();

  constructor(
    private readonly jobpostStateService: JobPostStateService,
    private readonly tokenService: TokenService,
    private readonly userService: UserService
  ) {
    this.jobpostStateService.data$.subscribe((data) => {
      this.logger.log(`Rcv data in socket gateway: ${data}`);
      // go thru connectedSockets and push info to client (socketClient.send(payload))
    });
  }

  handleDisconnect(client: Socket) {
    this.logger.log('-------Client Disconnected------');
  }

  async handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`-----Client Connected: ${client.id}-------`);
    const user = await this.authenticateConnection(client);
    this.addClientToConnectedSockets(user.id, client);
  }

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, payload: any): WsResponse<string> {
    this.logger.log('-----------Receive message from client---------------', payload);
    return { event: 'msgToClient', data: 'Hello from server' };
  }

  private async authenticateConnection(client: Socket): Promise<UserEntity> {
    const token = client.handshake.query.authorization as string;
    if (!this.tokenService.isTokenValid(token)) {
      throw new UnauthorizedException('Token Invalid');
    }
    const decoded = this.tokenService.getAccessTokenPayload(token);
    return this.userService.findUserById(decoded.userId);
  }

  private addClientToConnectedSockets(userId: string, client: Socket) {
    const userSockets = this.connectedSockets.get(userId);
    if (userSockets) {
      userSockets.push(client);
    } else {
      this.connectedSockets.set(userId, [client]);
    }
  }
}
