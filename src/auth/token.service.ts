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

@Injectable()
export class TokenService {
  private readonly JWT_SECRET = process.env.JWT_SECRET;

  constructor(
    @InjectRepository(RefreshTokenEntity)
    private readonly refreshTokenRepo: Repository<RefreshTokenEntity>
  ) {}

  public isTokenValid(token: string, ignoreExpiration: boolean = false) {
    try {
      jwt.verify(token, this.JWT_SECRET, {
        ignoreExpiration
      });

      return true;
    } catch (error) {
      return false;
    }
  }

  public getAccessTokenId(token: string) {
    // jti is the id of this token, meta data from the payload
    const decodedToken = jwt.decode(token);
    return decodedToken['jti'];
  }

  public async isRefreshTokenLinkedToAccessToken(refreshToken: RefreshTokenEntity, accessTokenId: string) {
    if (!refreshToken) return false;
    if (refreshToken.accessTokenId !== accessTokenId) return false;
    return true;
  }

  public async isRefreshTokenExpired(refreshToken: RefreshTokenEntity) {
    if (moment().isAfter(refreshToken.expiryDate)) return true;
    return false;
  }

  public async isRefreshTokenUsedOrInvalidated(refreshToken: RefreshTokenEntity) {
    return refreshToken.used || refreshToken.invalidated;
  }

  public getAccessTokenPayload(token: string) {
    return jwt.decode(token);
  }

  public async getRefreshTokenByAccessToken(accessToken: string) {
    const tokenId = this.getAccessTokenId(accessToken);

    const refreshToken = await this.refreshTokenRepo.findOne({
      accessTokenId: tokenId
    });

    if (!refreshToken) throw new BadRequestException('Refresh token does not exist');

    return refreshToken;
  }

  public async invalidateRefreshToken(refreshToken: RefreshTokenEntity) {
    refreshToken.invalidated = true;
    await this.refreshTokenRepo.save(refreshToken);
  }

  public async generateAccessTokenAndRefreshToken(user: UserEntity): Promise<CredentialsTokens> {
    const payload: AccessTokenPayload = {
      userId: user.id,
      email: user.email
    };

    const accessTokenId = uuidv4();

    const accessToken = jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: '1h',
      // accessTokenId needed for the refresh token, as a refresh token only points to one single unique access token
      jwtid: accessTokenId,
      // the subject should be the users id (primary key)
      subject: user.id
    });

    const refreshToken = await this.generateRefreshTokenForUserAndAccessToken(user, accessTokenId);

    return { accessToken, refreshToken };
  }

  private async generateRefreshTokenForUserAndAccessToken(user: UserEntity, accessTokenId: string) {
    const refreshToken = new RefreshTokenEntity();
    refreshToken.user = user;
    refreshToken.accessTokenId = accessTokenId;
    refreshToken.expiryDate = moment()
      .add(7, 'd')
      .toDate();

    await this.refreshTokenRepo.save(refreshToken);

    return refreshToken.id;
  }
}
