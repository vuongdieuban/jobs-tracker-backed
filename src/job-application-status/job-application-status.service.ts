import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobApplicationStatusEntity } from './entities/job-application-status.entity';

@Injectable()
export class JobApplicationStatusService {
  constructor(
    @InjectRepository(JobApplicationStatusEntity)
    private readonly applicationStatuRepo: Repository<JobApplicationStatusEntity>
  ) {}

  public async findAll(): Promise<JobApplicationStatusEntity[]> {
    return this.applicationStatuRepo.find();
  }
}
