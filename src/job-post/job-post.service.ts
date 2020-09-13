import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PlatformEntity } from 'src/platform/entities/platform.entity';
import { Repository } from 'typeorm';
import { JobPostDto } from './dto/job-post.dto';
import { JobPostEntity } from './entities/job-post.entity';

@Injectable()
export class JobPostService {
  constructor(
    @InjectRepository(JobPostEntity)
    private readonly jobPostRepository: Repository<JobPostEntity>,
    @InjectRepository(PlatformEntity)
    private readonly platformRepo: Repository<PlatformEntity>
  ) {}

  async findAll(): Promise<JobPostDto[]> {
    const data = await this.jobPostRepository.find({ relations: ['platform'] });
    return data.map((d) => this.parseJobPostResponse(d));
  }

  async findOne(id: string): Promise<JobPostDto> {
    const data = await this.jobPostRepository.findOneOrFail(id, { relations: ['platform'] }).catch((e) => {
      throw new NotFoundException(`Cannot find job post with id ${id}`);
    });
    return this.parseJobPostResponse(data);
  }

  async create(jobPost: JobPostDto): Promise<JobPostDto> {
    const { platformId, platformJobKey } = jobPost;
    const platform = await this.platformRepo.findOneOrFail(platformId).catch((e) => {
      throw new NotFoundException(`Cannot find platform with id ${platformId}`);
    });

    const existedJobPost = await this.jobPostRepository
      .createQueryBuilder('jobPost')
      .leftJoinAndSelect('jobPost.platform', 'platform')
      .where('jobPost.platformJobKey = :platformJobKey', { platformJobKey })
      .andWhere('platform.id = :platformId', { platformId })
      .getOne();

    if (existedJobPost) {
      return this.parseJobPostResponse(existedJobPost);
    }

    let createdJobPost = this.jobPostRepository.create(jobPost);
    createdJobPost.platform = platform;
    createdJobPost = await createdJobPost.save();
    return this.parseJobPostResponse(createdJobPost);
  }

  private parseJobPostResponse(jobPost: JobPostEntity): JobPostDto {
    const response = { ...jobPost, platformId: jobPost.platform.id };
    delete response.platform;
    return response;
  }
}
