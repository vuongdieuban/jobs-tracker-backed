// https://medium.com/@mohsenes/websocket-cluster-with-nestjs-and-redis-a18882d418ed

import { Logger, UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WsResponse
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { JobPostStateService } from './job-post/job-post-state.service';
import { WebsocketAuthGuard } from './websocket/websocket-auth.guard';

@WebSocketGateway()
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger: Logger = new Logger('AppGateway');

  private readonly connectedSockets = new Map<string, Socket[]>();

  constructor(private readonly jobpostStateService: JobPostStateService) {
    this.jobpostStateService.data$.subscribe((data) => {
      this.logger.log(`Rcv data in socket gateway: ${data}`);
      // go thru connectedSockets and push info to client (socketClient.send(payload))
    });
  }

  handleDisconnect(client: Socket) {
    this.logger.log('-------Client Disconnected------');
  }

  @UseGuards(WebsocketAuthGuard)
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
