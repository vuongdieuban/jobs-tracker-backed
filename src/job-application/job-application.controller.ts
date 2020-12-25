import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserRequest } from 'src/shared/interfaces/user-request.interface';
import { JobApplicationEntity } from './entities/job-application.entity';
import { ArchiveApplicationRequestDto } from './dto/request/archive-application-request.dto';
import { CreateApplicationRequestDto } from './dto/request/create-application-request.dto';
import { ReorderApplicationRequestDto } from './dto/request/reorder-application-request.dto';
import { ApplicationReorderedResponseDto } from './dto/response';
import { ApplicationUpdatedResponseDto } from './dto/response/application-updated-response.dto';
import { JobApplicationService } from './job-application.service';

@UseGuards(JwtAuthGuard)
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
  ): Promise<ApplicationReorderedResponseDto> {
    const data = await this.jobApplicationService.reorder(id, payload);
    return this.parseApplicationReorderedResponse(data);
  }

  @Put('/archive/:id')
  public async archive(
    @Param('id') id: string,
    @Body() payload: ArchiveApplicationRequestDto,
  ): Promise<ApplicationUpdatedResponseDto> {
    const data = await this.jobApplicationService.archive(id, payload.archive);
    return this.parseApplicationUpdatedResponse(data);
  }

  private parseApplicationUpdatedResponse(data: JobApplicationEntity): ApplicationUpdatedResponseDto {
    return {
      id: data.id,
      position: data.position,
      archive: data.archive,
      statusId: data.status.id,
      jobPostId: data.jobPost.id,
      userId: data.user.id,
    };
  }

  private parseApplicationReorderedResponse(data: JobApplicationEntity): ApplicationReorderedResponseDto {
    return {
      id: data.id,
      position: data.position,
      statusId: data.status.id,
    };
  }
}
