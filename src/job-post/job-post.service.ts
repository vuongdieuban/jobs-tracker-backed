import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobPostDTO } from './dto/job-post.dto';
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

  async create(jobPost: JobPostDTO): Promise<JobPostEntity> {
    const createdJobPost = this.jobPostRepository.create(jobPost);
    await createdJobPost.save();
    return createdJobPost;
  }
}
