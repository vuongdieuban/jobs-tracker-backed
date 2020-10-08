// https://medium.com/@mohsenes/websocket-cluster-with-nestjs-and-redis-a18882d418ed

import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WsResponse
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { JobPostStateService } from './job-post/job-post-state.service';

interface ConnectedClientSockets {
  [key: string]: Socket[]; // userId: [socketClient1, socketClient2, ...]
}

@WebSocketGateway()
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger: Logger = new Logger('AppGateway');

  private readonly connectedSockets: ConnectedClientSockets = {};

  constructor(private readonly jobpostStateService: JobPostStateService) {
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
    // Add connected client to the connectedSocket map
  }

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, payload: any): WsResponse<string> {
    this.logger.log('-----------Receive message from client---------------');
    return { event: 'msgToClient', data: 'Hello from server' };
  }
}
