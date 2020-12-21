import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlatformEntity } from './entities/platform.entity';

@Injectable()
export class PlatformService {
  constructor(
    @InjectRepository(PlatformEntity)
    private readonly platformRepo: Repository<PlatformEntity>,
  ) {}

  public async findAll(): Promise<PlatformEntity[]> {
    return this.platformRepo.find();
  }
}
