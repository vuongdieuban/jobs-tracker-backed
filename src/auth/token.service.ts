import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { access } from 'fs';
import * as jwt from 'jsonwebtoken';
import * as moment from 'moment';
import { UserEntity } from 'src/shared/entities/user.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { RefreshTokenEntity } from '../shared/entities/refresh-token.entity';
import { AccessTokenPayload } from './interfaces/access-token-payload';
import { CredentialsTokens } from './interfaces/credentials-token';
import { RefreshTokenPayload } from './interfaces/refresh-token-payload';

interface GeneratedRefreshToken {
  refreshTokenId: string;
  signedRefreshToken: string;
}

@Injectable()
export class TokenService {
  private readonly JWT_SECRET: string;

  constructor(
    @InjectRepository(RefreshTokenEntity)
    private readonly refreshTokenRepo: Repository<RefreshTokenEntity>,
  ) {
    if (!process.env.JWT_SECRET) {
      throw new Error('Fatal Error. Env JWT_SECRET not defined');
    }
    this.JWT_SECRET = process.env.JWT_SECRET;
  }

  public isTokenValid(token: string, ignoreExpiration: boolean = false): boolean {
    try {
      jwt.verify(token, this.JWT_SECRET, {
        ignoreExpiration,
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  public isAccessTokenLinkToRefreshToken(signedAccessToken: string, refreshToken: RefreshTokenEntity) {
    const accessToken = jwt.decode(signedAccessToken) as AccessTokenPayload;
    return accessToken.refreshTokenId === refreshToken.id;
  }

  public getAccessTokenId(signedToken: string): string {
    const decodedToken = jwt.decode(signedToken) as AccessTokenPayload;
    return decodedToken.accessTokenId;
  }

  public getRefreshTokenId(signedToken: string): string {
    const decodedToken = jwt.decode(signedToken) as RefreshTokenPayload;
    return decodedToken.refreshTokenId;
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

  public async getRefreshTokenById(refreshTokenId: string): Promise<RefreshTokenEntity | null> {
    const refreshToken = await this.refreshTokenRepo.findOne(refreshTokenId, { relations: ['user'] });
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
    const { refreshTokenId, signedRefreshToken } = await this.generateRefreshToken(user);
    const signedAccessToken = this.generateAccessToken(user, refreshTokenId);
    return { accessToken: signedAccessToken, refreshToken: signedRefreshToken };
  }

  public async generateRefreshToken(user: UserEntity): Promise<GeneratedRefreshToken> {
    let refreshToken = new RefreshTokenEntity();
    refreshToken.user = user;
    refreshToken.expiryDate = moment()
      .add(7, 'd')
      .toDate();

    refreshToken = await this.refreshTokenRepo.save(refreshToken);

    const payload: RefreshTokenPayload = {
      refreshTokenId: refreshToken.id,
      userId: user.id,
    };

    const signedRefreshToken = jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: '7d',
      jwtid: refreshToken.id,
      subject: user.id,
    });

    return { refreshTokenId: refreshToken.id, signedRefreshToken };
  }

  public generateAccessToken(user: UserEntity, refreshTokenId: string): string {
    const accessTokenId = uuidv4();
    const payload: AccessTokenPayload = {
      accessTokenId,
      refreshTokenId,
      userId: user.id,
      email: user.email,
    };

    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: '1h',
      jwtid: accessTokenId,
      // the subject should be the users id (primary key)
      subject: user.id,
    });
  }
}
