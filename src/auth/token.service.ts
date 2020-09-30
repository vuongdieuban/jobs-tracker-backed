import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as jwt from 'jsonwebtoken';
import * as moment from 'moment';
import { UserEntity } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { RefreshTokenEntity } from './entities/refresh-token.entity';
import { AccessTokenPayload } from './interfaces/access-token-payload';
import { CredentialsTokens } from './interfaces/credentials-token';
import { RefreshTokenPayload } from './interfaces/refresh-token-payload';

interface GeneratedAccessToken {
  accessTokenId: string;
  signedAccessToken: string;
}

@Injectable()
export class TokenService {
  private readonly JWT_SECRET = process.env.JWT_SECRET;

  constructor(
    @InjectRepository(RefreshTokenEntity)
    private readonly refreshTokenRepo: Repository<RefreshTokenEntity>
  ) {}

  public isTokenValid(token: string, ignoreExpiration: boolean = false): boolean {
    try {
      jwt.verify(token, this.JWT_SECRET, {
        ignoreExpiration
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  public getAccessTokenId(token: string): string {
    const decodedToken = jwt.decode(token) as AccessTokenPayload;
    return decodedToken.accessTokenId;
  }

  public isRefreshTokenLinkedToAccessToken(refreshToken: RefreshTokenEntity, accessTokenId: string): boolean {
    return refreshToken.accessTokenId === accessTokenId;
  }

  public isRefreshTokenExpired(refreshToken: RefreshTokenEntity): boolean {
    return moment().isAfter(refreshToken.expiryDate);
  }

  public isRefreshTokenInvalidated(refreshToken: RefreshTokenEntity): boolean {
    return refreshToken.invalidated;
  }

  public getAccessTokenPayload(token: string): AccessTokenPayload {
    return jwt.decode(token) as AccessTokenPayload;
  }

  public async getRefreshTokenByAccessToken(accessToken: string): Promise<RefreshTokenEntity | null> {
    const tokenId = this.getAccessTokenId(accessToken);
    const refreshToken = await this.refreshTokenRepo.findOne({
      where: { accessTokenId: tokenId }
    });

    if (!refreshToken) {
      return null;
    }
    return refreshToken;
  }

  public async invalidateRefreshToken(refreshToken: RefreshTokenEntity): Promise<void> {
    refreshToken.invalidated = true;
    await this.refreshTokenRepo.save(refreshToken);
  }

  public async generateAccessTokenAndRefreshToken(user: UserEntity): Promise<CredentialsTokens> {
    const { signedAccessToken, accessTokenId } = this.generateAccessToken(user);
    const signedRefreshToken = await this.generateRefreshToken(user, accessTokenId);
    return { accessToken: signedAccessToken, refreshToken: signedRefreshToken };
  }

  private generateAccessToken(user: UserEntity): GeneratedAccessToken {
    const accessTokenId = uuidv4();
    const payload: AccessTokenPayload = {
      accessTokenId,
      userId: user.id,
      email: user.email
    };

    const signedAccessToken = jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: '1h',
      // accessTokenId needed for the refresh token, as a refresh token only points to one single unique access token
      jwtid: accessTokenId,
      // the subject should be the users id (primary key)
      subject: user.id
    });

    return { signedAccessToken, accessTokenId };
  }

  private async generateRefreshToken(user: UserEntity, accessTokenId: string): Promise<string> {
    let refreshToken = new RefreshTokenEntity();
    refreshToken.user = user;
    refreshToken.accessTokenId = accessTokenId;
    refreshToken.expiryDate = moment()
      .add(7, 'd')
      .toDate();

    refreshToken = await this.refreshTokenRepo.save(refreshToken);

    const payload: RefreshTokenPayload = {
      accessTokenId,
      refreshTokenId: refreshToken.id,
      userId: user.id
    };

    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: '7d',
      jwtid: refreshToken.id,
      subject: user.id
    });
  }
}
