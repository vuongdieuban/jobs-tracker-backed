import { BadGatewayException, BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JobApplicationStatusEntity } from 'src/job-application-status/entities/job-application-status.entity';
import { JobPostEntity } from 'src/job-post/entities/job-post.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';
import { CreateApplicationRequestDto } from './dto/request/create-application-request.dto';
import { ReorderApplicationRequestDto } from './dto/request/reorder-application-request.dto';
import { ApplicationUpdatedResponseDto } from './dto/response/application-updated-response.dto';
import { JobApplicationEntity } from './entities/job-application.entity';
import { JobApplicationEventsPublisher } from './job-application-events-publisher.service';
import { ReorderApplicationsService } from './reorder-applications.service';

@Injectable()
export class JobApplicationService {
  constructor(
    private readonly eventsPublisher: JobApplicationEventsPublisher,
    private readonly reorderService: ReorderApplicationsService,
    @InjectRepository(JobApplicationEntity)
    private readonly jobApplicationRepo: Repository<JobApplicationEntity>,
    @InjectRepository(JobApplicationStatusEntity)
    private readonly applicationStatusRepo: Repository<JobApplicationStatusEntity>,
    @InjectRepository(JobPostEntity)
    private readonly jobPostReo: Repository<JobPostEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>
  ) {}

  public async findAllApplicationsOfUser(userId: string): Promise<JobApplicationEntity[]> {
    return this.getAllApplicationsOfUser(userId);
  }

  public async create(userId: string, payload: CreateApplicationRequestDto): Promise<JobApplicationEntity> {
    try {
      const { jobPostId, statusId } = payload;
      const jobPostPromise = this.jobPostReo.findOneOrFail(jobPostId, { relations: ['platform'] });
      const userPromise = this.userRepo.findOneOrFail(userId);
      const statusPromise = this.applicationStatusRepo.findOneOrFail(statusId);
      const lastPositionPromise = this.getLastPositionFromStatus(statusId, userId);
      const [jobPost, status, user, lastPosition] = await Promise.all([
        jobPostPromise,
        statusPromise,
        userPromise,
        lastPositionPromise
      ]);

      const application = new JobApplicationEntity();
      application.jobPost = jobPost;
      application.status = status;
      application.user = user;
      application.position = lastPosition; // last position in this status

      const createdApplication = await application.save();
      this.eventsPublisher.applicationCreated(createdApplication);
      return createdApplication;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException(error.message);
      } else if (error instanceof QueryFailedError) {
        throw new BadRequestException(error.message);
      } else {
        throw new BadGatewayException(error.message);
      }
    }
  }

  public async archive(applicationId: string, archiveValue: boolean): Promise<ApplicationUpdatedResponseDto> {
    const application = await this.getApplicationById(applicationId);
    const updatedData = archiveValue
      ? await this.reorderService.archiveApplication(application)
      : await this.reorderService.unarchiveApplication(application);
    return this.parseApplicationUpdatedResponse(updatedData);
  }

  public async reorder(
    applicationId: string,
    reorderDto: ReorderApplicationRequestDto
  ): Promise<ApplicationUpdatedResponseDto> {
    const { statusId: desiredStatusId } = reorderDto;
    let { position: desiredPosition } = reorderDto;

    const statusPromise = this.applicationStatusRepo.findOneOrFail(desiredStatusId).catch((e) => {
      throw new NotFoundException(`Status with id ${applicationId} not found`);
    });

    const applicationPromise = this.getApplicationById(applicationId);
    const [status, application] = await Promise.all([statusPromise, applicationPromise]);

    const { position: currentPosition } = application;
    const { id: currentStatus } = application.status;

    if (currentPosition === desiredPosition && currentStatus === desiredStatusId) {
      return this.parseApplicationUpdatedResponse(application);
    }

    if (desiredPosition === undefined) {
      // make it the last position of this status
      desiredPosition = await this.getLastPositionFromStatus(status.id, application.user.id);
    }

    const updatedApplication = await this.moveApplication(application, status, desiredPosition);
    this.publishApplicationMovedEvent(currentStatus, updatedApplication);
    return this.parseApplicationUpdatedResponse(updatedApplication);
  }

  private publishApplicationMovedEvent(
    originalStatusId: string,
    updatedApplication: JobApplicationEntity
  ): void {
    if (originalStatusId === updatedApplication.status.id) {
      this.eventsPublisher.applicationReordered(updatedApplication);
      return;
    }
    this.eventsPublisher.applicationStatusChanged(originalStatusId, updatedApplication);
  }

  private async moveApplication(
    application: JobApplicationEntity,
    desiredStatus: JobApplicationStatusEntity,
    desiredPosition: number
  ): Promise<JobApplicationEntity> {
    if (application.status.id !== desiredStatus.id) {
      console.log('item inserted');
      return this.reorderService.changeApplicationStatus({ application, desiredPosition, desiredStatus });
    }

    if (desiredPosition > application.position) {
      console.log('item move down');
      return this.reorderService.moveApplicationDownWithinSameStatus({ application, desiredPosition });
    } else {
      console.log('item move up');
      return this.reorderService.moveApplicationUpWithinSameStatus({ application, desiredPosition });
    }
  }

  private async getApplicationById(applicationId: string): Promise<JobApplicationEntity> {
    return this.jobApplicationRepo
      .findOneOrFail(applicationId, {
        relations: ['status', 'jobPost', 'jobPost.platform', 'user']
      })
      .catch((e) => {
        throw new NotFoundException(`Application with id ${applicationId} not found`);
      });
  }

  private async getAllApplicationsOfUser(userId: string): Promise<JobApplicationEntity[]> {
    return this.jobApplicationRepo.find({
      where: { user: { id: userId } },
      relations: ['status', 'jobPost', 'jobPost.platform', 'user']
    });
  }

  private parseApplicationUpdatedResponse(application: JobApplicationEntity): ApplicationUpdatedResponseDto {
    return {
      id: application.id,
      position: application.position,
      archive: application.archive,
      statusId: application.status.id,
      jobPostId: application.jobPost.id,
      userId: application.user.id
    };
  }

  private async getLastPositionFromStatus(statusId: string, userId: string): Promise<number> {
    return this.jobApplicationRepo.count({
      user: { id: userId },
      status: { id: statusId },
      archive: false
    });
  }
}
