import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { RefreshTokenEntity } from '../shared/entities/refresh-token.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { TokenService } from './token.service';

@Module({
  imports: [PassportModule, UserModule, TypeOrmModule.forFeature([RefreshTokenEntity])],
  providers: [AuthService, JwtStrategy, TokenService],
  controllers: [AuthController],
  exports: [TokenService],
})
export class AuthModule {}
