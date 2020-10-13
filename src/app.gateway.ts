import { Logger, UseGuards } from '@nestjs/common';
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
import { UserService } from './user/user.service';

// TODO: Put AuthGuard here if client send message in. Implemented in ./auth/websocket-auth.guard
// Not needed currently because we only push event out, and already authenticate in handleConnection.
// NOTE: AuthGuard does not affect handleConnection, ie: have to handle auth logic in handlConnection

// @UseGuards(WebsocketAuthGuard)
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

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`-----Client Connected: ${client.id}-------`);
    // Authenticated
    // Add connected client to the connectedSocket map
  }

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, payload: any): WsResponse<string> {
    this.logger.log('-----------Receive message from client---------------');
    return { event: 'msgToClient', data: 'Hello from server' };
  }
}
