import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StatusEntity } from '../shared/entities/status.entity';

@Injectable()
export class StatusService {
  constructor(
    @InjectRepository(StatusEntity)
    private readonly statuRepo: Repository<StatusEntity>,
  ) {}

  public async findAll(): Promise<StatusEntity[]> {
    return this.statuRepo.find();
  }
}
