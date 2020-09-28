import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import * as moment from 'moment';
import { UserService } from 'src/user/user.service';
import { CredentialsTokenDto } from './dto/credentials-token.dto';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  private readonly oauth2Client: OAuth2Client;

  constructor(private readonly userService: UserService, private readonly tokenService: TokenService) {
    this.oauth2Client = new OAuth2Client({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    });
  }

  async login(accessToken: string): Promise<CredentialsTokenDto> {
    const email = await this.googleOAuth(accessToken);

    // const {} = this.tokenService.generateAccessTokenAndRefreshToken(user)
    return {
      accessToken: '',
      refreshToken: ''
    };
  }

  async validateUser(userEmail: string) {
    const user = await this.userService.findUserByEmail(userEmail);
    if (!user) {
      return null;
    }
    return user;
  }

  private async googleOAuth(accessToken: string): Promise<string> {
    this.oauth2Client.setCredentials({ access_token: accessToken });
    const googleTokenData = await this.oauth2Client.getTokenInfo(accessToken).catch((e) => {
      throw new UnauthorizedException('Invalid Token');
    });
    console.log('Google Data', googleTokenData);
    const { email, expiry_date } = googleTokenData;
    const expiryDate = Math.round(expiry_date / 1000); // convert from milliseconds to seconds
    const currentTime = moment().unix(); // in seconds

    if (currentTime > expiryDate) {
      throw new UnauthorizedException('Invalid Token');
    }

    return email;
  }
}
