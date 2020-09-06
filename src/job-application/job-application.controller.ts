import { Body, Controller, Get, Param, Post, Put, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ReorderApplicationRequestDto } from './dto/reorder-application-request.dto';
import { ReorderApplicationResponseDto } from './dto/reorder-application-response.dto';
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
  public async reorder(
    @Param('id') id: string,
    @Body() reorderDto: ReorderApplicationRequestDto
  ): Promise<ReorderApplicationResponseDto> {
    return this.jobApplicationService.reorder(id, reorderDto);
  }
}
