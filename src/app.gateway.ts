import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WsResponse
} from '@nestjs/websockets';
import { JobPostStateService } from './job-post/job-post-state.service';

interface ConnectedSockets {
  [key: string]: any[];
}

@WebSocketGateway()
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger: Logger = new Logger('AppGateway');

  private readonly connectedSockets: ConnectedSockets = {};

  constructor(private readonly jobpostStateService: JobPostStateService) {
    this.jobpostStateService.data$.subscribe((data) => {
      this.logger.log(`Rcv data in socket gateway ${data}`);
      // go thru connectedSockets and push info to client
    });
  }

  handleDisconnect(client: any) {
    this.logger.log('Client Disconnected');
  }

  handleConnection(client: any, ...args: any[]) {
    this.logger.log('Client Connected');
    // Add connected client to the connectedSocket map
  }

  @SubscribeMessage('msgToServer')
  handleMessage(client: any, payload: any): WsResponse<string> {
    return { event: 'msgToClient', data: 'Hello from server' };
  }
}
