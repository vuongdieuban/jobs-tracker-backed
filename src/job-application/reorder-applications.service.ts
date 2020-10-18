import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JobApplicationStatusEntity } from 'src/job-application-status/entities/job-application-status.entity';
import { Repository } from 'typeorm';
import { JobApplicationEntity } from './entities/job-application.entity';

interface BaseApplicationAction {
  desiredApplication: JobApplicationEntity;
  applications: JobApplicationEntity[];
}

interface ApplicationToMove extends BaseApplicationAction {
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

  public async moveApplicationUp(
    application: JobApplicationEntity,
    desiredPosition: number
  ): Promise<JobApplicationEntity> {
    const currentPosition = application.position;
    await this.applicationRepo
      .createQueryBuilder()
      .update()
      .set({ position: () => 'position + 1' })
      .where('position >= :desiredPosition', { desiredPosition })
      .andWhere('position < :currentPosition', { currentPosition })
      .andWhere('user.id = :userId', { userId: application.user.id })
      .andWhere('status.id = :statusId', { statusId: application.status.id })
      .andWhere('id != :applicationId', { applicationId: application.id })
      .execute();

    const updateFields = {
      ...application,
      id: application.id,
      position: desiredPosition
    } as JobApplicationEntity;

    return this.applicationRepo.save(updateFields);
  }

  public async moveApplicationDown(
    application: JobApplicationEntity,
    desiredPosition: number
  ): Promise<JobApplicationEntity> {
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

    const updateFields = {
      ...application,
      id: application.id,
      position: desiredPosition
    } as JobApplicationEntity;

    return this.applicationRepo.save(updateFields);
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

  public applicationStatusChange(data: ApplicationStatusChange): JobApplicationEntity[] {
    const { desiredApplication, desiredPosition, desiredStatus, applications } = data;
    const desiredStatusId = desiredStatus.id;

    const currentPosition = desiredApplication.position;

    // items that have to move up
    const sourceItemsToUpdate = applications.filter(
      (a) => a.status.id === desiredApplication.status.id && a.position > currentPosition
    );

    const destinationItems = applications.filter((a) => a.status.id === desiredStatusId);
    // items that have to move down
    const destinationItemsToUpdate = destinationItems.filter((a) => a.position >= desiredPosition);

    this.checkInsertPosibility(desiredPosition, destinationItems.length);

    const updatedSource = this.itemsMoveUp(sourceItemsToUpdate);
    const updatedDestination = this.itemsMoveDown(destinationItemsToUpdate);

    desiredApplication.position = desiredPosition;
    desiredApplication.status = desiredStatus;

    updatedDestination.push(desiredApplication);
    return updatedSource.concat(updatedDestination);
  }

  private itemsMoveUp(items: JobApplicationEntity[]): JobApplicationEntity[] {
    return items.map((i) => {
      return {
        ...i,
        position: i.position - 1
      } as JobApplicationEntity;
    });
  }

  private itemsMoveDown(items: JobApplicationEntity[]): JobApplicationEntity[] {
    return items.map((i) => {
      return {
        ...i,
        position: i.position + 1
      } as JobApplicationEntity;
    });
  }

  private checkInsertPosibility(desiredPosition: number, totalLength: number) {
    if (totalLength) {
      if (desiredPosition > totalLength) {
        throw new BadRequestException('Cannot insert at this position.');
      }
    } else {
      if (desiredPosition > 0) {
        throw new BadRequestException('Cannot insert at this position.');
      }
    }
  }
}
