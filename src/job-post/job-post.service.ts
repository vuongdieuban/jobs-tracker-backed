import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PlatformEntity } from 'src/platform/entities/platform.entity';
import { Repository } from 'typeorm';
import { JobPostEntity } from './entities/job-post.entity';
import { JobPostDto } from './dto/job-post.dto';

@Injectable()
export class JobPostService {
  constructor(
    @InjectRepository(JobPostEntity)
    private readonly jobPostRepository: Repository<JobPostEntity>,
    @InjectRepository(PlatformEntity)
    private readonly platformRepo: Repository<PlatformEntity>,
  ) {}

  async findAll(): Promise<JobPostEntity[]> {
    return this.jobPostRepository.find({ relations: ['platform'] });
  }

  async findOne(id: string): Promise<JobPostEntity> {
    return this.jobPostRepository.findOneOrFail(id, { relations: ['platform'] }).catch(e => {
      throw new NotFoundException(`Cannot find job post with id ${id}`);
    });
  }

  async getOrCreate(jobPost: JobPostDto): Promise<JobPostEntity> {
    const { platformId, platformJobKey } = jobPost;
    const platform = await this.platformRepo.findOneOrFail(platformId).catch(e => {
      throw new NotFoundException(`Cannot find platform with id ${platformId}`);
    });

    const existedJobPost = await this.jobPostRepository
      .createQueryBuilder()
      .select()
      .where('platform_job_key= :platformJobKey', { platformJobKey })
      .andWhere('platform_id = :platformId', { platformId })
      .getOne();
    if (existedJobPost) {
      return existedJobPost;
    }

    let createdJobPost = this.jobPostRepository.create(jobPost);
    createdJobPost.platform = platform;
    createdJobPost = await createdJobPost.save();
    return createdJobPost;
  }
}
