import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { UserEntity } from 'src/user/entities/user.entity';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/request/login-request.dto';
import { LoginResponseDto } from './dto/response/login-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  public async login(
    @Body() payload: LoginRequestDto,
    @Res() response: Response
  ): Promise<Response<LoginResponseDto>> {
    const localEnv = process.env.NODE_ENV === 'development';
    const [user, { accessToken, refreshToken }] = await this.authService.login(payload.accessToken);
    response.cookie('refresh_token', refreshToken, {
      domain: '.jobs-tracker.localhost', // Needed for cookie to appear in browser
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: localEnv ? 'lax' : 'none', // Needed for Chrome. Make none (with secure) if subdomain can't be set
      secure: !localEnv, // Makes cookie need https. required for sameSite.None
      httpOnly: true // Cookie can't be accessed by javaScript
    });

    // since we return response object it doesn't go thru transform interceptor to remove the meta data`
    const sanitzedUser = this.sanitizeUser(user);
    return response.json({ accessToken, user: sanitzedUser });
  }

  @Post('/logout')
  public async logout() {
    // TODO:
    // Get the refresh token id from the cookie,
    // Get the access token from bearer authorization header (even if the access token is expired thats fine)
    // validate that the refresh token exist in database
    // Validate the refresh token has the same accessTokenId as the one in Bear Auth header
    // and then set refresh token invalidated to true, save, then remove the fresh token from the cookie
    return 'logout success';
  }

  @Post('/refresh-token')
  public async refreshToken() {
    // TODO:
    // Get the refresh token id from the cookie,
    // Get the access token from bearer authorization header (don't need to check for expiry date)
    // validate that the refresh token exist in database
    // Validate the refresh token has the same accessTokenId as the one in Bear Auth header
    // and then set refresh token invalidated to true, save;
    // Generate a new refresh token and access token pair.
    // return new access token, set the new refresh token in teh cookie
  }

  private sanitizeUser(user: UserEntity) {
    const { createdTs, updatedTs, ...sanitized } = user;
    return sanitized;
  }
}
