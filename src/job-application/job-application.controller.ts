import { Body, Controller, Get, Param, Post, Put, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApplicationUpdatedResponseDto } from './dto/application-updated-response.dto';
import { ReorderApplicationRequestDto } from './dto/reorder-application-request.dto';
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

  @Post('')
  public async create(): Promise<ApplicationUpdatedResponseDto> {
    return;
  }

  @Put('/reorder/:id')
  public async reorder(
    @Param('id') id: string,
    @Body() reorderDto: ReorderApplicationRequestDto
  ): Promise<ApplicationUpdatedResponseDto> {
    return this.jobApplicationService.reorder(id, reorderDto);
  }

  @Put('/:id')
  public async update(@Param('id') id: string): Promise<ApplicationUpdatedResponseDto> {
    return;
  }
}
