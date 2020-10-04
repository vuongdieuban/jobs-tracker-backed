import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import * as moment from 'moment';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { CredentialsTokens } from './interfaces/credentials-token';
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

  public async login(googleAccessToken: string): Promise<[UserEntity, CredentialsTokens]> {
    const email = await this.googleOAuth(googleAccessToken);
    const user = await this.userService.getOrCreateUser(email);
    const credentialsTokens = await this.tokenService.generateAccessTokenAndRefreshToken(user);
    return [user, credentialsTokens];
  }

  public async logout(signedAccessToken: string, signedRefreshToken: string): Promise<void> {
    const isAccessTokenValid = this.tokenService.isTokenValid(signedAccessToken, true);
    const isRefreshTokenValid = this.tokenService.isTokenValid(signedRefreshToken, true);
    if (!(isAccessTokenValid && isRefreshTokenValid)) {
      throw new UnauthorizedException('Invalid Token');
    }

    const refreshTokenId = this.tokenService.getRefreshTokenId(signedRefreshToken);
    const refreshToken = await this.tokenService.getRefreshTokenById(refreshTokenId);

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    if (!this.tokenService.isAccessTokenLinkToRefreshToken(signedAccessToken, refreshToken)) {
      throw new UnauthorizedException('Access Token and Refresh Token do not match');
    }

    if (this.tokenService.isRefreshTokenInvalidated(refreshToken)) {
      throw new UnauthorizedException('Refresh Token Invalidated');
    }
    await this.tokenService.invalidateRefreshToken(refreshToken);
  }

  public async renewAccessToken(signedRefreshToken: string): Promise<[UserEntity, CredentialsTokens]> {
    const isRefreshTokenValid = this.tokenService.isTokenValid(signedRefreshToken, true);
    if (!isRefreshTokenValid) {
      throw new UnauthorizedException('Invalid Refresh Token');
    }

    const refreshTokenId = this.tokenService.getRefreshTokenId(signedRefreshToken);
    const refreshToken = await this.tokenService.getRefreshTokenById(refreshTokenId);

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh Token not found');
    }

    if (this.tokenService.isRefreshTokenInvalidated(refreshToken)) {
      throw new UnauthorizedException('Refresh Token invalidated');
    }

    if (this.tokenService.isRefreshTokenExpired(refreshToken)) {
      await this.tokenService.invalidateRefreshToken(refreshToken);
      throw new UnauthorizedException('Refresh Token Expired');
    }

    const { user } = refreshToken;
    const signedAccessToken = this.tokenService.generateAccessToken(user, refreshToken.id);

    const updatedCredentials: CredentialsTokens = {
      accessToken: signedAccessToken,
      refreshToken: signedRefreshToken
    };
    return [user, updatedCredentials];
  }

  private async googleOAuth(accessToken: string): Promise<string> {
    this.oauth2Client.setCredentials({ access_token: accessToken });

    const googleTokenData = await this.oauth2Client.getTokenInfo(accessToken).catch((e) => {
      throw new UnauthorizedException('Invalid Google Oauth Access Token');
    });

    const { email, expiry_date } = googleTokenData;
    const expiryDate = Math.round(expiry_date / 1000); // convert from milliseconds to seconds
    const currentTime = moment().unix(); // in seconds

    if (currentTime > expiryDate) {
      throw new UnauthorizedException('Token expired');
    }

    return email;
  }
}
