import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JobApplicationStatusEntity } from 'src/job-application-status/entities/job-application-status.entity';
import { Repository } from 'typeorm';
import { JobApplicationEntity } from './entities/job-application.entity';

interface ApplicationToMove {
  application: JobApplicationEntity;
  desiredPosition: number;
}

interface ApplicationStatusChange extends ApplicationToMove {
  desiredStatus: JobApplicationStatusEntity;
}

@Injectable()
export class ReorderApplicationsService {
  constructor(
    @InjectRepository(JobApplicationEntity)
    private readonly applicationRepo: Repository<JobApplicationEntity>
  ) {}

  public async moveApplicationUpWithinSameStatus(data: ApplicationToMove): Promise<JobApplicationEntity> {
    const { application, desiredPosition } = data;
    await this.moveApplicationsDownDueToReorder(application, desiredPosition);
    return this.applicationRepo.save({ ...application, position: desiredPosition });
  }

  public async moveApplicationDownWithinSameStatus(data: ApplicationToMove): Promise<JobApplicationEntity> {
    const { application, desiredPosition } = data;
    await this.moveApplicationsUpDueToReorder(application, desiredPosition);
    return this.applicationRepo.save({ ...application, position: desiredPosition });
  }

  public async changeApplicationStatus(data: ApplicationStatusChange): Promise<JobApplicationEntity> {
    const { application, desiredPosition, desiredStatus } = data;
    await this.moveApplicationsUpDueToRemoval(application);
    await this.moveApplicationsDownDueToInsertion(application, desiredPosition, desiredStatus.id);
    return this.applicationRepo.save({ ...application, position: desiredPosition, status: desiredStatus });
  }

  public async archiveApplication(application: JobApplicationEntity): Promise<JobApplicationEntity> {
    await this.moveApplicationsUpDueToRemoval(application);
    return this.applicationRepo.save({ ...application, archive: true });
  }

  private async moveApplicationsDownDueToReorder(
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
      .andWhere('archive = :archive', { archive: false })
      .execute();
    return;
  }

  private async moveApplicationsUpDueToReorder(
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
      .andWhere('archive = :archive', { archive: false })
      .execute();
    return;
  }

  private async moveApplicationsUpDueToRemoval(removedApplication: JobApplicationEntity): Promise<void> {
    const currentPosition = removedApplication.position;
    await this.applicationRepo
      .createQueryBuilder()
      .update()
      .set({ position: () => 'position - 1' })
      .where('position > :currentPosition', { currentPosition })
      .andWhere('user.id = :userId', { userId: removedApplication.user.id })
      .andWhere('status.id = :statusId', { statusId: removedApplication.status.id })
      .andWhere('id != :applicationId', { applicationId: removedApplication.id })
      .andWhere('archive = :archive', { archive: false })
      .execute();
    return;
  }

  private async moveApplicationsDownDueToInsertion(
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
      .andWhere('archive = :archive', { archive: false })
      .execute();
    return;
  }
}
