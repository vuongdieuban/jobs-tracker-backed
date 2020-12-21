import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { JobPostEntity } from './entities/job-post.entity';
import { JobPostDto } from './dto/job-post.dto';
import { JobPostService } from './job-post.service';

@UseGuards(JwtAuthGuard)
@Controller('job-post')
@ApiTags('job-post')
export class JobPostController {
  constructor(private readonly jobPostService: JobPostService) {}

  @Get('/')
  async findAll(): Promise<JobPostEntity[]> {
    return this.jobPostService.findAll();
  }

  @Post('/')
  async getOrCreate(@Body() jobPost: JobPostDto): Promise<JobPostEntity> {
    return this.jobPostService.getOrCreate(jobPost);
  }
}
