import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from './jwt.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(userEmail: string) {
    const user = await this.userRepo.findOne({ where: { email: userEmail } });
    if (!user) {
      return null;
    }
    return user;
  }
}
