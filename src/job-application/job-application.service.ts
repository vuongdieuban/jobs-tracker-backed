import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JobApplicationStatusEntity } from 'src/job-application-status/entities/job-application-status.entity';
import { Repository } from 'typeorm';
import { ApplicationUpdatedResponseDto } from './dto/application-updated-response.dto';
import { ReorderApplicationRequestDto } from './dto/reorder-application-request.dto';
import { JobApplicationEntity } from './entities/job-application.entity';
import { ReorderApplicationsService } from './reorder-applications.service';

@Injectable()
export class JobApplicationService {
  constructor(
    private readonly reorderService: ReorderApplicationsService,
    @InjectRepository(JobApplicationEntity)
    private readonly jobApplicationRepo: Repository<JobApplicationEntity>,
    @InjectRepository(JobApplicationStatusEntity)
    private readonly applicationStatusRepo: Repository<JobApplicationStatusEntity>
  ) {}

  public async getAll(): Promise<JobApplicationEntity[]> {
    return this.jobApplicationRepo.find({ relations: ['status', 'jobPost'] });
  }

  public async reorder(
    applicationId: string,
    reorderDto: ReorderApplicationRequestDto
  ): Promise<ApplicationUpdatedResponseDto> {
    const { position: desiredPosition, statusId: desiredStatusId } = reorderDto;

    const status = await this.applicationStatusRepo.findOneOrFail(desiredStatusId).catch((e) => {
      throw new NotFoundException(`Status with id ${applicationId} not found`);
    });

    const application = await this.jobApplicationRepo
      .findOneOrFail(applicationId, {
        relations: ['status']
      })
      .catch((e) => {
        throw new NotFoundException(`Application with id ${applicationId} not found`);
      });

    const { statusDisplayPosition: currentPosition } = application;
    const { id: currentStatus } = application.status;
    if (currentPosition === desiredPosition && currentStatus === desiredStatusId) {
      return {
        applicationId: application.id,
        statusId: currentStatus,
        position: currentPosition
      };
    }

    return this.moveApplication(application, status, desiredPosition);
  }

  private async moveApplication(
    application: JobApplicationEntity,
    desiredStatus: JobApplicationStatusEntity,
    desiredPosition: number
  ): Promise<ApplicationUpdatedResponseDto> {
    if (application.status.id !== desiredStatus.id) {
      console.log('item inserted');
      return this.applicationStatusChanged(application, desiredStatus, desiredPosition);
    }

    if (desiredPosition > application.statusDisplayPosition) {
      console.log('item move down');
      return this.applicationMoveDown(application, desiredPosition);
    } else {
      console.log('item move up');
      return this.applicationMoveUp(application, desiredPosition);
    }
  }

  private async applicationMoveUp(
    application: JobApplicationEntity,
    desiredPosition: number
  ): Promise<ApplicationUpdatedResponseDto> {
    const applications = await this.getApplicationsByStatusId(application.status.id);
    const reorderedApplications = this.reorderService.applicationMoveUp({
      desiredPosition,
      applications,
      desiredApplication: application
    });
    return this.saveReorderedApplications(application.id, reorderedApplications);
  }

  private async applicationMoveDown(
    application: JobApplicationEntity,
    desiredPosition: number
  ): Promise<ApplicationUpdatedResponseDto> {
    const applications = await this.getApplicationsByStatusId(application.status.id);
    const reorderedApplications = this.reorderService.applicationMoveDown({
      desiredPosition,
      applications,
      desiredApplication: application
    });
    return this.saveReorderedApplications(application.id, reorderedApplications);
  }

  private async applicationStatusChanged(
    application: JobApplicationEntity,
    desiredStatus: JobApplicationStatusEntity,
    desiredPosition: number
  ): Promise<ApplicationUpdatedResponseDto> {
    const applications = await this.jobApplicationRepo.find({
      relations: ['status']
    });

    const reorderedApplications = this.reorderService.applicationStatusChanged({
      desiredPosition,
      desiredStatus,
      applications,
      desiredApplication: application
    });

    return this.saveReorderedApplications(application.id, reorderedApplications);
  }

  private getApplicationsByStatusId(statusId: string): Promise<JobApplicationEntity[]> {
    return this.jobApplicationRepo.find({
      relations: ['status'],
      where: { status: { id: statusId } }
    });
  }

  private async saveReorderedApplications(
    desiredApplicationId: string,
    updatedApplications: JobApplicationEntity[]
  ): Promise<ApplicationUpdatedResponseDto> {
    const updatedData = await this.jobApplicationRepo.save(updatedApplications);
    const application = updatedData.find((a) => a.id === desiredApplicationId);

    return {
      applicationId: application.id,
      statusId: application.status.id,
      position: application.statusDisplayPosition
    };
  }
}
