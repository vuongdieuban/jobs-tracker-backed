import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JobPostDto } from './dto/job-post.dto';
import { JobPostEntity } from './entities/job-post.entity';
import { JobPostService } from './job-post.service';

@Controller('job-post')
@ApiTags('job-post')
export class JobPostController {
  constructor(private readonly jobPostService: JobPostService) {}

  @Get('/')
  async findAll(): Promise<JobPostDto[]> {
    return this.jobPostService.findAll();
  }

  @Post('/')
  async create(@Body() jobPost: JobPostDto): Promise<JobPostDto> {
    return this.jobPostService.create(jobPost);
  }
}
