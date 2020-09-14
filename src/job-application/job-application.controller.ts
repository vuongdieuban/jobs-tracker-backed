import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApplicationUpdatedResponseDto } from './dto/application-updated-response.dto';
import { CreateApplicationRequestDto } from './dto/create-application-request.dto';
import { ReorderApplicationRequestDto } from './dto/reorder-application-request.dto';
import { JobApplicationEntity } from './entities/job-application.entity';
import { JobApplicationService } from './job-application.service';

@Controller('job-application')
@ApiTags('job-application')
export class JobApplicationController {
  constructor(private readonly jobApplicationService: JobApplicationService) {}

  @Get('/')
  public async findAll(): Promise<JobApplicationEntity[]> {
    return this.jobApplicationService.findAll();
  }

  @Post('/')
  public async create(@Body() payload: CreateApplicationRequestDto): Promise<JobApplicationEntity> {
    return this.jobApplicationService.create(payload);
  }

  @Put('/reorder/:id')
  public async reorder(
    @Param('id') id: string,
    @Body() payload: ReorderApplicationRequestDto
  ): Promise<ApplicationUpdatedResponseDto> {
    return this.jobApplicationService.reorder(id, payload);
  }

  @Put('/:id')
  public async update(@Param('id') id: string): Promise<ApplicationUpdatedResponseDto> {
    // Maybe this endpoint is not needed, maybe can directly update data from reorder.
    return;
  }

  @Delete('/:id')
  public async archive(@Param('id') id: string): Promise<ApplicationUpdatedResponseDto> {
    return this.jobApplicationService.archive(id);
  }
}
