import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JobApplicationStatusEntity } from 'src/job-application-status/entities/job-application-status.entity';
import { Repository, UpdateQueryBuilder } from 'typeorm';
import { JobApplicationEntity } from './entities/job-application.entity';

interface BaseApplicationAction {
  applications: JobApplicationEntity[];
  desiredApplication: JobApplicationEntity;
}

interface ApplicationToMove {
  application: JobApplicationEntity;
  desiredPosition: number;
}

interface ApplicationStatusChange extends ApplicationToMove {
  desiredStatus: JobApplicationStatusEntity;
}

interface ApplicationArchive extends BaseApplicationAction {
  archiveStatus: JobApplicationStatusEntity;
}

@Injectable()
export class ReorderApplicationsService {
  constructor(
    @InjectRepository(JobApplicationEntity)
    private readonly applicationRepo: Repository<JobApplicationEntity>
  ) {}

  public async moveApplicationUp(data: ApplicationToMove): Promise<JobApplicationEntity> {
    const { application, desiredPosition } = data;
    await this.moveAffectedApplicationsDown(application, desiredPosition);
    return this.updateApplicationToDesiredPosition(application, desiredPosition);
  }

  public async moveApplicationDown(data: ApplicationToMove): Promise<JobApplicationEntity> {
    const { application, desiredPosition } = data;
    await this.moveAffectedApplicationsUp(application, desiredPosition);
    return this.updateApplicationToDesiredPosition(application, desiredPosition);
  }

  public async changeApplicationStatus(data: ApplicationStatusChange): Promise<JobApplicationEntity> {
    const { application, desiredPosition, desiredStatus } = data;
    await this.moveApplicationsFromSourceStatusUp(application);
    await this.moveApplicationsFromDestinationStatusDown(application, desiredPosition, desiredStatus.id);
    return this.updateApplicationToDesiredStatusAndPosition(data);
  }

  public applicationArchive(data: ApplicationArchive): JobApplicationEntity[] {
    const { applications, desiredApplication, archiveStatus } = data;
    const currentPosition = desiredApplication.position;

    const sourceItemsToUpdate = applications.filter(
      (a) => a.status.id === desiredApplication.status.id && a.position > currentPosition
    );

    const archivedItems = applications.filter((a) => a.status.id === archiveStatus.id);

    const updatedItems = this.itemsMoveUp(sourceItemsToUpdate);

    desiredApplication.status = archiveStatus;
    desiredApplication.position = archivedItems.length;

    updatedItems.push(desiredApplication);
    return updatedItems;
  }

  private async moveAffectedApplicationsDown(
    application: JobApplicationEntity,
    desiredPosition: number
  ): Promise<void> {
    const currentPosition = application.position;
    this.applicationRepo
      .createQueryBuilder()
      .update()
      .set({ position: () => 'position + 1' })
      .where('position >= :desiredPosition', { desiredPosition })
      .andWhere('position < :currentPosition', { currentPosition })
      .andWhere('user.id = :userId', { userId: application.user.id })
      .andWhere('status.id = :statusId', { statusId: application.status.id })
      .andWhere('id != :applicationId', { applicationId: application.id })
      .execute();
    return;
  }

  private async moveAffectedApplicationsUp(
    application: JobApplicationEntity,
    desiredPosition: number
  ): Promise<void> {
    const currentPosition = application.position;
    await this.applicationRepo
      .createQueryBuilder()
      .update()
      .set({ position: () => 'position - 1' })
      .where('position > :currentPosition', { currentPosition })
      .andWhere('position <= :desiredPosition', { desiredPosition })
      .andWhere('user.id = :userId', { userId: application.user.id })
      .andWhere('status.id = :statusId', { statusId: application.status.id })
      .andWhere('id != :applicationId', { applicationId: application.id })
      .execute();
    return;
  }

  private async moveApplicationsFromSourceStatusUp(removedApplication: JobApplicationEntity): Promise<void> {
    const currentPosition = removedApplication.position;
    await this.applicationRepo
      .createQueryBuilder()
      .update()
      .set({ position: () => 'position - 1' })
      .where('position > :currentPosition', { currentPosition })
      .andWhere('user.id = :userId', { userId: removedApplication.user.id })
      .andWhere('status.id = :statusId', { statusId: removedApplication.status.id })
      .andWhere('id != :applicationId', { applicationId: removedApplication.id })
      .execute();
    return;
  }

  private async moveApplicationsFromDestinationStatusDown(
    insertedApplication: JobApplicationEntity,
    desiredPosition: number,
    desiredStatusId: string
  ): Promise<void> {
    await this.applicationRepo
      .createQueryBuilder()
      .update()
      .set({ position: () => 'position + 1' })
      .where('position >= :desiredPosition', { desiredPosition })
      .andWhere('user.id = :userId', { userId: insertedApplication.user.id })
      .andWhere('status.id = :desiredStatusId', { desiredStatusId })
      .execute();
    return;
  }

  private async updateApplicationToDesiredStatusAndPosition(
    data: ApplicationStatusChange
  ): Promise<JobApplicationEntity> {
    const { application, desiredPosition, desiredStatus } = data;
    return this.applicationRepo.save({
      ...application,
      position: desiredPosition,
      status: desiredStatus
    });
  }

  private async updateApplicationToDesiredPosition(
    application: JobApplicationEntity,
    desiredPosition: number
  ): Promise<JobApplicationEntity> {
    const updateFields = { ...application, position: desiredPosition } as JobApplicationEntity;
    return this.applicationRepo.save(updateFields);
  }

  private itemsMoveUp(items: JobApplicationEntity[]): JobApplicationEntity[] {
    return items.map((i) => {
      return {
        ...i,
        position: i.position - 1
      } as JobApplicationEntity;
    });
  }
}
