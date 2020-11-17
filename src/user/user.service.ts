import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  public async findUserById(id: string): Promise<UserEntity> {
    return this.userRepo.findOneOrFail(id).catch(e => {
      throw new NotFoundException(`User with id ${id} not found`);
    });
  }

  public async findAll(): Promise<UserEntity[]> {
    return this.userRepo.find();
  }

  public async findUserByEmail(userEmail: string): Promise<UserEntity> {
    return this.userRepo.findOneOrFail({ where: { email: userEmail } });
  }

  public async getOrCreateUser(userEmail: string): Promise<UserEntity> {
    let user = await this.userRepo.findOne({ where: { email: userEmail } });
    if (user) {
      return user;
    }

    user = this.userRepo.create({ email: userEmail });
    return this.userRepo.save(user);
  }
}
