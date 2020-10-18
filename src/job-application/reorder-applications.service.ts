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

  public async moveApplicationUp(desiredApplication: JobApplicationEntity, desiredPosition: number) {
    const currentPosition = desiredApplication.position;

    await this.applicationRepo
      .createQueryBuilder()
      .update()
      .set({ position: () => 'position + 1' })
      .where('position >= :desiredPosition', { desiredPosition })
      .andWhere('position < :currentPosition', { currentPosition })
      .andWhere('user.id = :userId', { userId: desiredApplication.user.id })
      .andWhere('status.id = :statusId', { statusId: desiredApplication.status.id })
      .andWhere('id != :applicationId', { applicationId: desiredApplication.id })
      .execute();

    const updateFields: Partial<JobApplicationEntity> = {
      ...desiredApplication,
      id: desiredApplication.id,
      position: desiredPosition
    };
    const updatedApplication = await this.applicationRepo.save(updateFields);
    return updatedApplication;
  }

  public applicationMoveDown(data: ApplicationToMove): JobApplicationEntity[] {
    const { desiredApplication, desiredPosition, applications } = data;
    this.checkReorderPosibility(desiredPosition, applications.length);
    const currentPosition = desiredApplication.position;

    const applicationsToUpdate = applications.filter(
      (a) => a.position > currentPosition && a.position <= desiredPosition
    );

    const updatedItems = this.itemsMoveUp(applicationsToUpdate);

    desiredApplication.position = desiredPosition;

    updatedItems.push(desiredApplication);
    return updatedItems;
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

  private checkReorderPosibility(desiredPosition: number, totalLength: number) {
    // display order start at 0
    if (desiredPosition >= totalLength) {
      throw new BadRequestException('Cannot move to unexisted order.');
    }
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
