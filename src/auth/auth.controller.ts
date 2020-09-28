import { Body, Controller, Post, Res, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  private readonly oauth2Client: OAuth2Client;

  constructor(private readonly authService: AuthService) {
    this.oauth2Client = new OAuth2Client({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    });
  }

  @Post('/login')
  public async login(@Body() payload: LoginDto, @Res() response: Response) {
    const { accessToken } = payload;
    this.oauth2Client.setCredentials({ access_token: accessToken });
    const data = await this.oauth2Client.getTokenInfo(accessToken).catch((e) => {
      throw new UnauthorizedException('Invalid Token');
    });

    const localEnv = process.env.NODE_ENV === 'development';
    const token = 'rtyq';
    response.cookie('refresh_token', token, {
      domain: '.jobs-tracker.localhost', // Needed for cookie to appear in browser
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: localEnv ? 'lax' : 'none', // Needed for Chrome. Make none (with secure) if subdomain can't be set
      secure: !localEnv, // Makes cookie need https. required for sameSite.None
      httpOnly: true // Cookie can't be accessed by javaScript
    });

    response.json({ token, data });
  }
}
