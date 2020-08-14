import { Body, Controller, Get, Post } from '@nestjs/common';
import { JobPostDTO } from './dto/job-post.dto';
import { JobPostEntity } from './entities/job-post.entity';
import { JobPostService } from './job-post.service';

@Controller('job-post')
export class JobPostController {

  constructor(private readonly jobPostService: JobPostService) { }

  @Get('/')
  async findAll(): Promise<JobPostEntity[]> {
    return this.jobPostService.findAll();
  }

  @Post('/')
  async create(@Body() jobPost: JobPostDTO): Promise<JobPostEntity> {
    return this.jobPostService.create(jobPost);
  }
}
