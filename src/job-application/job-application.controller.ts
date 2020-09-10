import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
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

  @Get('')
  public async getAll(): Promise<JobApplicationEntity[]> {
    return this.jobApplicationService.getAll();
  }

  @Post('')
  public async create(@Body() payload: CreateApplicationRequestDto): Promise<ApplicationUpdatedResponseDto> {
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
    // This endpoint is for updating application detail stuff, but DOES NOT allow to update display position
    // If Status changed, then automatically insert to the latest position of the new status,
    // Otherwise, assume status display position does not change.
    // There should be a special status called "Archived" that we don't show on screen in the frontend board, but show in a diff page
    // Archive will have all the closed application.

    // Maybe this endpoint is not needed, maybe can directly update data from reorder.
    return;
  }
}
