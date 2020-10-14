import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { TokenService } from './token.service';

// https://github.com/nestjs/nest/issues/1254
// @UseGuards(WsJwtGuard) // Or apply at the class level (ie: underneath @Injectable())
// @SubscribeMessage('events')
// onEvent(client, data); // data.user contains your user if you set it in the guard (context.switchToWs().getData().user = decoded.userId;)

// On Clientside, if Authtoken is renewed, re-connect with token in query param

@Injectable()
export class WebsocketAuthGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient();
    const token = client.handshake.query.authorization;
    if (!this.tokenService.isTokenValid(token)) {
      return false;
    }
    const decoded = this.tokenService.getAccessTokenPayload(token);

    const data = context.switchToWs().getData();
    if (!data) {
      throw new WsException('Data cannot be undefined, send an empty object instead');
    }
    data.userId = decoded.userId;
    return true;
  }
}
