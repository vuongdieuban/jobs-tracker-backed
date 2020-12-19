import { BadGatewayException, BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusEntity } from 'src/shared/entities/status.entity';
import { JobPostEntity } from 'src/shared/entities/job-post.entity';
import { UserEntity } from 'src/shared/entities/user.entity';
import { ReorderPositionService } from 'src/shared/services/reorder-position';
import { QueryFailedError, Repository } from 'typeorm';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';
import { JobApplicationEntity } from '../shared/entities/job-application.entity';
import { CreateApplicationRequestDto } from './dto/request/create-application-request.dto';
import { ReorderApplicationRequestDto } from './dto/request/reorder-application-request.dto';
import { JobApplicationEventsPublisher } from './job-application-events-publisher.service';
import { ReorderApplicationsService } from './reorder-applications.service';
import { PositionTopOrBottom } from './types';

@Injectable()
export class JobApplicationService {
  constructor(
    private readonly reorderPositionService: ReorderPositionService,
    private readonly eventsPublisher: JobApplicationEventsPublisher,
    private readonly reorderService: ReorderApplicationsService,
    @InjectRepository(JobApplicationEntity)
    private readonly jobApplicationRepo: Repository<JobApplicationEntity>,
    @InjectRepository(StatusEntity)
    private readonly statusRepo: Repository<StatusEntity>,
    @InjectRepository(JobPostEntity)
    private readonly jobPostReo: Repository<JobPostEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  public async findAllApplicationsOfUser(userId: string): Promise<JobApplicationEntity[]> {
    return this.getAllApplicationsOfUser(userId);
  }

  public async create(userId: string, payload: CreateApplicationRequestDto): Promise<JobApplicationEntity> {
    try {
      const { jobPostId, statusId } = payload;
      const jobPostPromise = this.jobPostReo.findOneOrFail(jobPostId, { relations: ['platform'] });
      const userPromise = this.userRepo.findOneOrFail(userId);
      const statusPromise = this.statusRepo.findOneOrFail(statusId);
      const lastPositionPromise = this.getLastPositionFromStatus(statusId, userId);
      const [jobPost, status, user, lastPosition] = await Promise.all([
        jobPostPromise,
        statusPromise,
        userPromise,
        lastPositionPromise,
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

  public async archive(applicationId: string, archiveValue: boolean): Promise<JobApplicationEntity> {
    const application = await this.getApplicationById(applicationId);
    const updatedData = archiveValue
      ? await this.reorderService.archiveApplication(application)
      : await this.reorderService.unarchiveApplication(application);
    return updatedData;
  }

  public async reorder(
    applicationId: string,
    payload: ReorderApplicationRequestDto,
  ): Promise<JobApplicationEntity> {
    const { statusId: desiredStatusId, position: desiredPosition } = payload;

    const statusPromise = this.statusRepo
      .createQueryBuilder('status')
      .leftJoinAndSelect('status.jobApplications', 'application')
      .where('status.id = :statusId', { statusId: desiredStatusId })
      .orderBy('application.position', 'ASC')
      .getOneOrFail()
      .catch(() => {
        throw new NotFoundException(`Not status found with id ${desiredStatusId}`);
      });

    const applicationPromise = this.getApplicationById(applicationId);
    const [status, application] = await Promise.all([statusPromise, applicationPromise]);

    if (typeof desiredPosition === 'string') {
      return application;
    }

    return this.moveApplicationToSpecificPosition(application, status.jobApplications, desiredPosition);
  }

  private publishApplicationMovedEvent(
    originalStatusId: string,
    updatedApplication: JobApplicationEntity,
  ): void {
    if (originalStatusId === updatedApplication.status.id) {
      this.eventsPublisher.applicationReordered(updatedApplication);
      return;
    }
    this.eventsPublisher.applicationStatusChanged(originalStatusId, updatedApplication);
  }

  private moveApplicationToTopOrBottomOfList(position: PositionTopOrBottom) {
    console.log('Move Position', position);
    return;
  }

  private async moveApplicationToSpecificPosition(
    applicationToInsert: JobApplicationEntity,
    sortedApplicationsList: JobApplicationEntity[],
    desiredPosition: number,
  ): Promise<JobApplicationEntity> {
    const updatedData = this.reorderPositionService.moveItemInSameList<JobApplicationEntity>(
      { id: applicationToInsert.id, position: desiredPosition },
      sortedApplicationsList,
    );

    const { insertedItem, updatedItems } = updatedData;
    await this.jobApplicationRepo.save(updatedItems);

    return insertedItem;
  }

  private async getApplicationById(applicationId: string): Promise<JobApplicationEntity> {
    return this.jobApplicationRepo
      .findOneOrFail(applicationId, {
        relations: ['status', 'jobPost', 'jobPost.platform', 'user'],
      })
      .catch(() => {
        throw new NotFoundException(`Application with id ${applicationId} not found`);
      });
  }

  private async getAllApplicationsOfUser(userId: string): Promise<JobApplicationEntity[]> {
    return this.jobApplicationRepo.find({
      where: { user: { id: userId } },
      relations: ['status', 'jobPost', 'jobPost.platform', 'user'],
    });
  }

  private async getLastPositionFromStatus(statusId: string, userId: string): Promise<number> {
    return this.jobApplicationRepo.count({
      user: { id: userId },
      status: { id: statusId },
      archive: false,
    });
  }
}
