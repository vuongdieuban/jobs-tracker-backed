import { Body, Controller, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { CookieOptions, Request, Response } from 'express';
import { UserEntity } from 'src/user/entities/user.entity';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/request/login-request.dto';
import { LoginResponseDto } from './dto/response/login-response.dto';

@Controller('auth')
export class AuthController {
  private readonly REFRESH_TOKEN_COOKIE_NAME = 'jobs_tracker_refresh_token';
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  public async login(@Body() payload: LoginRequestDto, @Res() response: Response): Promise<void> {
    const [user, { accessToken, refreshToken }] = await this.authService.login(payload.accessToken);

    // since we return response object it doesn't go thru transform interceptor to remove the meta data so we have to manually sanitize it
    const sanitzedUser = this.sanitizeUser(user);
    const cookieOptions = this.getCookieOptions();

    response.cookie(this.REFRESH_TOKEN_COOKIE_NAME, refreshToken, cookieOptions);
    response.json({ accessToken, user: sanitzedUser } as LoginResponseDto);
  }

  @Post('/logout')
  public async logout(@Req() request: Request, @Res() response: Response): Promise<void> {
    const accessToken = this.extractAccessTokenFromAuthHeader(request);
    const refreshToken = this.extractRefreshTokenFromCookie(request);

    await this.authService.logout(accessToken, refreshToken);
    const cookieOptions = this.getCookieOptions();

    response.clearCookie(this.REFRESH_TOKEN_COOKIE_NAME, { ...cookieOptions, maxAge: 0 });
    response.send('logout success');
  }

  @Post('/renew-token')
  public async renewAuthToken(@Req() request: Request, @Res() response: Response): Promise<void> {
    const existedRefreshToken = this.extractRefreshTokenFromCookie(request);
    const [user, { refreshToken, accessToken }] = await this.authService.renewAuthToken(existedRefreshToken);

    const sanitzedUser = this.sanitizeUser(user);
    const cookieOptions = this.getCookieOptions();

    response.cookie(this.REFRESH_TOKEN_COOKIE_NAME, refreshToken, cookieOptions);
    response.json({ accessToken, user: sanitzedUser });
  }

  private sanitizeUser(user: UserEntity) {
    const { createdTs, updatedTs, ...sanitized } = user;
    return sanitized;
  }

  private extractAccessTokenFromAuthHeader(request: Request): string {
    // Authorization: Bearer eyJhbGciOiJIUzI1NiIXVCJ9...TJVA95OrM7E20RMHrHDcEfxjoYZgeFONFh7HgQ
    const bearerToken =
      (request.headers['authorization'] as string) || (request.headers['Authorization'] as string);

    if (!bearerToken) {
      throw new UnauthorizedException('Missing Authorization Bearer token in request header');
    }
    return bearerToken.split(' ')[1];
  }

  private extractRefreshTokenFromCookie(request: Request): string {
    const refreshToken = request.cookies[this.REFRESH_TOKEN_COOKIE_NAME];
    if (!refreshToken) {
      throw new UnauthorizedException('Missing refresh token in cookie');
    }
    return refreshToken;
  }

  private getCookieOptions(): CookieOptions {
    const localEnv = process.env.NODE_ENV === 'development';
    return {
      domain: '.jobs-tracker.localhost',
      sameSite: localEnv ? 'lax' : 'none',
      secure: !localEnv,
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    };
  }
}
