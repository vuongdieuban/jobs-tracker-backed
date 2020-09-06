import { Body, Controller, Get, Param, Post, Put, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ReorderApplicationDto } from './dto/reorder-application.dto';
import { JobApplicationEntity } from './entities/job-application.entity';
import { JobApplicationService } from './job-application.service';

@Controller('job-application')
@ApiTags('job-application')
export class JobApplicationController {
  constructor(private readonly jobApplicationService: JobApplicationService) {}

  @Get('')
  public async getAll(): Promise<JobApplicationEntity[]> {
    return this.jobApplicationService.getAll();
  }

  @Put('/reorder/:id')
  public async reorder(@Param('id') id: string, @Body() reorderDto: ReorderApplicationDto): Promise<any> {
    return this.jobApplicationService.reorder(id, reorderDto);
  }
}
