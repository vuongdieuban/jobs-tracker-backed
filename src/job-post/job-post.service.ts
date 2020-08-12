import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobPostEntity } from './entities/job-post.entity';

@Injectable()
export class JobPostService {
  constructor(
    @InjectRepository(JobPostEntity)
    private readonly jobPostRepository: Repository<JobPostEntity>,
  ) { }

  findAll(): Promise<JobPostEntity[]> {
    return this.jobPostRepository.find();
  }

  findOne(id: string): Promise<JobPostEntity> {
    return this.jobPostRepository.findOne(id);
  }
}
