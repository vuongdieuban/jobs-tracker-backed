import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  public async login(@Body() payload: LoginDto, @Res() response: Response) {
    const localEnv = process.env.NODE_ENV === 'development';
    const { accessToken, refreshToken } = await this.authService.login(payload.accessToken);
    response.cookie('refresh_token', refreshToken, {
      domain: '.jobs-tracker.localhost', // Needed for cookie to appear in browser
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: localEnv ? 'lax' : 'none', // Needed for Chrome. Make none (with secure) if subdomain can't be set
      secure: !localEnv, // Makes cookie need https. required for sameSite.None
      httpOnly: true // Cookie can't be accessed by javaScript
    });

    response.json({ accessToken });
  }

  @Post('/logout')
  public async logout() {}

  @Post('/refresh-token')
  public async refreshToken() {}
}
