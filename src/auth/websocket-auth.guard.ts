import { CanActivate, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import * as jwt from 'jsonwebtoken';
import { AccessTokenPayload } from 'src/auth/interfaces/access-token-payload';
import { TokenService } from './token.service';

// https://github.com/nestjs/nest/issues/1254
// @UseGuards(WsJwtGuard) // Or apply at the class level (ie: underneath @Injectable())
// @SubscribeMessage('events')
// onEvent(client, data); // data.user contains your user if you set it in the guard (context.switchToWs().getData().user = decoded.userId;)

// On Clientside, if Authtoken is renewed, re-connect with new header

@Injectable()
export class WebsocketAuthGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  async canActivate(context: any): Promise<boolean> {
    const client = context.switchToWs().getClient();
    const bearerToken = client.handshake.headers.authorization.split(' ')[1];
    try {
      const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET) as AccessTokenPayload;
      context.switchToWs().getData().user = decoded.userId;
      return true;
    } catch (err) {
      console.log('Websocket Guard Error', err);
      return false;
      //  throw new WsException()
    }
  }
}
