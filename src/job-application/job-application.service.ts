import { BadGatewayException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusEntity } from 'src/shared/entities/status.entity';
import { JobPostEntity } from 'src/shared/entities/job-post.entity';
import { UserEntity } from 'src/shared/entities/user.entity';
import { ReorderPositionService } from 'src/shared/services/reorder-position';
import { Repository } from 'typeorm';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';
import { JobApplicationEntity } from '../shared/entities/job-application.entity';
import { CreateApplicationRequestDto } from './dto/request/create-application-request.dto';
import { ReorderApplicationRequestDto } from './dto/request/reorder-application-request.dto';
import { JobApplicationEventsPublisher } from './job-application-events-publisher.service';
import { PositionTopOrBottom } from './types';
import { SPACE_BETWEEN_ITEM } from 'src/shared/constants';

@Injectable()
export class JobApplicationService {
  constructor(
    private readonly reorderPositionService: ReorderPositionService,
    private readonly eventsPublisher: JobApplicationEventsPublisher,
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
      const lastPositionPromise = this.countApplicationsFromStatus(statusId, userId);
      const [jobPost, status, user, lastPosition] = await Promise.all([
        jobPostPromise,
        statusPromise,
        userPromise,
        lastPositionPromise,
      ]);

      const application = this.jobApplicationRepo.create({
        jobPost,
        status,
        user,
        position: lastPosition,
      });

      const createdApplication = await application.save();
      this.eventsPublisher.applicationCreated(createdApplication);
      return createdApplication;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException(error.message);
      } else {
        throw new BadGatewayException(error.message);
      }
    }
  }

  public async archive(applicationId: string, archiveValue: boolean): Promise<JobApplicationEntity> {
    const application = await this.getApplicationById(applicationId);
    // const updatedData = archiveValue;
    // ? await this.reorderService.archiveApplication(application)
    // : await this.reorderService.unarchiveApplication(application);
    return application;
  }

  public async reorder(
    applicationId: string,
    payload: ReorderApplicationRequestDto,
  ): Promise<JobApplicationEntity> {
    const { statusId, position } = payload;

    const statusPromise = this.statusRepo.findOneOrFail({ id: statusId }).catch(() => {
      throw new NotFoundException(`No status found with id ${statusId}`);
    });

    const applicationPromise = this.getApplicationById(applicationId);
    const applicationListPromise = this.getAllApplicationsFromStatus(statusId);
    const [, application, applicationList] = await Promise.all([
      statusPromise,
      applicationPromise,
      applicationListPromise,
    ]);

    if (typeof position === 'string') {
      return this.moveApplicationToTopOrBottomOfList(application, applicationList, position);
    }

    return this.moveApplicationToSpecificPosition(application, applicationList, position);
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

  private async moveApplicationToTopOrBottomOfList(
    applicationToInsert: JobApplicationEntity,
    sortedApplicationsList: JobApplicationEntity[],
    desiredPosition: PositionTopOrBottom,
  ): Promise<JobApplicationEntity> {
    const listLength = sortedApplicationsList.length;
    if (desiredPosition === 'top' || listLength === 0) {
      return this.moveApplicationToSpecificPosition(applicationToInsert, sortedApplicationsList, 0);
    }

    const currentBottomApplication = sortedApplicationsList[listLength - 1]; // last item in the list
    applicationToInsert.position = currentBottomApplication.position + SPACE_BETWEEN_ITEM;

    await this.jobApplicationRepo.save(applicationToInsert);
    return applicationToInsert;
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
    return this.jobApplicationRepo.findOneOrFail(applicationId, { relations: ['status'] }).catch(() => {
      throw new NotFoundException(`Application with id ${applicationId} not found`);
    });
  }

  private async getAllApplicationsOfUser(userId: string): Promise<JobApplicationEntity[]> {
    return this.jobApplicationRepo.find({
      where: { user: { id: userId } },
      relations: ['status', 'jobPost', 'jobPost.platform', 'user'],
    });
  }

  private async countApplicationsFromStatus(statusId: string, userId: string): Promise<number> {
    return this.jobApplicationRepo.count({
      user: { id: userId },
      status: { id: statusId },
      archive: false,
    });
  }

  private async getAllApplicationsFromStatus(statusId: string): Promise<JobApplicationEntity[]> {
    return this.jobApplicationRepo
      .createQueryBuilder('application')
      .leftJoinAndSelect('application.status', 'status')
      .where('status.id = :statusId', { statusId: statusId })
      .orderBy('application.position', 'ASC')
      .getMany();
  }
}
