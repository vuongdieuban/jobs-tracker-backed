import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WsResponse
} from '@nestjs/websockets';

@WebSocketGateway()
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger: Logger = new Logger('AppGateway');


  handleDisconnect(client: any) {
    this.logger.log('Client Disconnected');
  }

  handleConnection(client: any, ...args: any[]) {
    this.logger.log('Client Connected');
  }

  @SubscribeMessage('msgToServer')
  handleMessage(client: any, payload: any): WsResponse<string> {
    return { event: 'msgToClient', data: 'Hello from server' };
  }
}
