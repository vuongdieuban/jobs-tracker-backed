import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JobApplicationStatusEntity } from 'src/job-application-status/entities/job-application-status.entity';
import { Repository } from 'typeorm';
import { ReorderApplicationRequestDto } from './dto/reorder-application-request.dto';
import { ReorderApplicationResponseDto } from './dto/reorder-application-response.dto';
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
  ): Promise<ReorderApplicationResponseDto> {
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

    return this.updateMovedApplication(application, desiredStatusId, desiredPosition);
  }

  private async updateMovedApplication(
    application: JobApplicationEntity,
    desiredStatusId: string,
    desiredPosition: number
  ): Promise<ReorderApplicationResponseDto> {
    if (application.status.id !== desiredStatusId) {
      console.log('item inserted');
      return this.applicationStatusChanged(application, desiredPosition, desiredStatusId);
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
  ): Promise<ReorderApplicationResponseDto> {
    const statusId = application.status.id;
    const allApplications = await this.getApplicationsByStatusId(statusId);
    const updatedApplications = this.reorderService.applicationMoveUp({
      desiredPosition,
      allApplications,
      desiredApplication: application
    });
    return this.handleApplicationMovedUpdated(application.id, updatedApplications);
  }

  private async applicationMoveDown(
    application: JobApplicationEntity,
    desiredPosition: number
  ): Promise<ReorderApplicationResponseDto> {
    const statusId = application.status.id;
    const allApplications = await this.getApplicationsByStatusId(statusId);
    const updatedApplications = this.reorderService.applicationMoveDown({
      desiredPosition,
      allApplications,
      desiredApplication: application
    });
    return this.handleApplicationMovedUpdated(application.id, updatedApplications);
  }

  private async applicationStatusChanged(
    application: JobApplicationEntity,
    desiredPosition: number,
    updatedStatus: string
  ): Promise<ReorderApplicationResponseDto> {
    return;
  }

  private getApplicationsByStatusId(statusId: string): Promise<JobApplicationEntity[]> {
    return this.jobApplicationRepo.find({
      relations: ['status'],
      where: { status: { id: statusId } }
    });
  }

  private async handleApplicationMovedUpdated(
    desiredApplicationId: string,
    updatedApplications: JobApplicationEntity[]
  ): Promise<ReorderApplicationResponseDto> {
    await this.jobApplicationRepo.save(updatedApplications);
    const updatedApplication = updatedApplications.find((a) => a.id === desiredApplicationId);

    return {
      applicationId: updatedApplication.id,
      statusId: updatedApplication.status.id,
      position: updatedApplication.statusDisplayPosition
    };
  }
}
