import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserRequest } from 'src/shared/interfaces/user-request.interface';
import { JobApplicationEntity } from '../shared/entities/job-application.entity';
import { ArchiveApplicationRequestDto } from './dto/request/archive-application-request.dto';
import { CreateApplicationRequestDto } from './dto/request/create-application-request.dto';
import { ReorderApplicationRequestDto } from './dto/request/reorder-application-request.dto';
import { ApplicationUpdatedResponseDto } from './dto/response/application-updated-response.dto';
import { JobApplicationService } from './job-application.service';

// @UseGuards(JwtAuthGuard)
@Controller('job-application')
@ApiTags('job-application')
export class JobApplicationController {
  constructor(private readonly jobApplicationService: JobApplicationService) {}

  @Get('/')
  public async findAll(@Req() req: UserRequest): Promise<JobApplicationEntity[]> {
    return this.jobApplicationService.findAllApplicationsOfUser(req.user.id);
  }

  @Post('/')
  public async create(
    @Req() req: UserRequest,
    @Body() payload: CreateApplicationRequestDto,
  ): Promise<JobApplicationEntity> {
    return this.jobApplicationService.create(req.user.id, payload);
  }

  @Put('/reorder/:id')
  public async reorder(
    @Param('id') id: string,
    @Body() payload: ReorderApplicationRequestDto,
  ): Promise<ApplicationUpdatedResponseDto> {
    return this.jobApplicationService.reorder(id, payload);
  }

  @Put('/archive/:id')
  public async archive(
    @Param('id') id: string,
    @Body() payload: ArchiveApplicationRequestDto,
  ): Promise<ApplicationUpdatedResponseDto> {
    return this.jobApplicationService.archive(id, payload.archive);
  }

  @Put('/test-reorder/:id')
  public async testReorder(@Param('id') id: string, @Body() payload: ReorderApplicationRequestDto) {
    return this.jobApplicationService.testReorder(id, payload);
  }
}
