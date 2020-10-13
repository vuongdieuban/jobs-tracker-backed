import { CanActivate, Injectable } from '@nestjs/common';
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

  async canActivate(context: any): Promise<boolean> {
    const client = context.switchToWs().getClient();
    const token = client.handshake.query.authorization;
    try {
      const tokenValid = this.tokenService.isTokenValid(token);
      if (!tokenValid) {
        return false;
      }
      const decoded = this.tokenService.getAccessTokenPayload(token);

      context.switchToWs().getData().user = decoded.userId;
      return true;
    } catch (err) {
      console.log('Websocket Guard Error', err);
      return false;
      //  throw new WsException()
    }
  }
}
