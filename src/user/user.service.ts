import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>
  ) {}

  public async findAll(): Promise<UserEntity[]> {
    return this.userRepo.find();
  }

  public async findUserByEmail(userEmail: string): Promise<UserEntity> {
    return this.userRepo.findOne({ where: { email: userEmail } });
  }
}
