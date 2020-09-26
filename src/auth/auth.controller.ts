import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  @Get('/login')
  public async login(@Req() request: Request, @Res() response: Response) {
    const localEnv = process.env.NODE_ENV === 'development';
    const token = 'abcdef';
    response.cookie('refresh_token', token, {
      domain: 'jobs-tracker.localhost', // Needed for cookie to appear in browser
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: localEnv ? 'lax' : 'none', // Needed for Chrome. Make none (with secure) if subdomain can't be set
      secure: !localEnv, // Makes cookie need https. required for sameSite.None
      httpOnly: true // Cookie can't be accessed by javaScript
    });

    response.json({ token });
  }
}
