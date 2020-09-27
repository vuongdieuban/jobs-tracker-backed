import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as jwt from 'jsonwebtoken';
import * as moment from 'moment';
import { UserEntity } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { RefreshTokenEntity } from './entities/refresh-token.entity';

@Injectable()
export class JwtService {
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

  public getJwtId(token: string) {
    const decodedToken = jwt.decode(token);
    return decodedToken['jti'];
  }

  public async isRefreshTokenLinkedToToken(refreshToken: RefreshTokenEntity, jwtId: string) {
    if (!refreshToken) return false;

    if (refreshToken.jwtId !== jwtId) return false;

    return true;
  }

  public async isRefreshTokenExpired(refreshToken: RefreshTokenEntity) {
    if (moment().isAfter(refreshToken.expiryDate)) return true;

    return false;
  }

  public async isRefreshTokenUsedOrInvalidated(refreshToken: RefreshTokenEntity) {
    return refreshToken.used || refreshToken.invalidated;
  }

  public getJwtPayloadValueByKey(token: string, key: string) {
    const decodedToken = jwt.decode(token);
    return decodedToken[key];
  }

  public async getRefreshTokenByJwtToken(token: string) {
    // retrieve the jti/jwt-id from that token
    const jti = this.getJwtId(token);

    // retrieve the refresh token that points to this jwt-id
    const refreshToken = await this.refreshTokenRepo.findOne({
      jwtId: jti
    });

    if (!refreshToken) throw new Error('Refresh token does not exist');

    return refreshToken;
  }

  public async invalidateRefreshToken(refreshToken: RefreshTokenEntity) {
    refreshToken.invalidated = true;

    await this.refreshTokenRepo.save(refreshToken);
  }

  public async generateTokenAndRefreshToken(user: UserEntity) {
    // specify a payload thats holds the users id (and) email
    const payload = {
      id: user.id,
      email: user.email
    };

    const jwtId = uuidv4();

    const token = jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: '1h', // specify when does the token expires 1hour
      jwtid: jwtId, // specify jwtid (an id of that token) (needed for the refresh token, as a refresh token only points to one single unique token)
      subject: user.id.toString() // the subject should be the users id (primary key)
    });

    // create a refresh token
    const refreshToken = await this.generateRefreshTokenForUserAndToken(user, jwtId);

    // link that token with the refresh token

    return { token, refreshToken };
  }

  private async generateRefreshTokenForUserAndToken(user: UserEntity, jwtId: string) {
    // create a new record of refresh token
    const refreshToken = new RefreshTokenEntity();
    refreshToken.user = user;
    refreshToken.jwtId = jwtId;
    // set the expiry date of the refresh token for example 7 days
    refreshToken.expiryDate = moment()
      .add(7, 'd')
      .toDate();

    // store this refresh token
    await this.refreshTokenRepo.save(refreshToken);

    return refreshToken.id;
  }
}
