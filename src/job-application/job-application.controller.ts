import { Body, Controller, Param, Post, Put, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ReorderApplicationDto } from './dto/reorder-application.dto';
import { JobApplicationService } from './job-application.service';

@Controller('job-application')
@ApiTags('job-application')
export class JobApplicationController {
  constructor(private readonly jobApplicationService: JobApplicationService) {}

  @Put('/reorder/:id')
  public async reorder(@Param('id') id: string, @Body() reorderDto: ReorderApplicationDto): Promise<string> {
    return this.jobApplicationService.reorder(id, reorderDto);
  }
}
