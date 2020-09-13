import { BadRequestException, Injectable } from '@nestjs/common';
import { JobApplicationStatusEntity } from 'src/job-application-status/entities/job-application-status.entity';
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
  // Return array of all applications that have been updated
  // Desired application move up, other items in list move down
  public applicationMoveUp(data: ApplicationToMove): JobApplicationEntity[] {
    const { desiredApplication, desiredPosition, applications } = data;
    this.checkReorderPosibility(desiredPosition, applications.length);
    const currentPosition = desiredApplication.statusDisplayPosition;

    // Get all the items between current position and desired position
    const applicationsToUpdate = applications.filter(
      (a) => a.statusDisplayPosition >= desiredPosition && a.statusDisplayPosition < currentPosition
    );

    // Increment position by 1 because all those items are moving down
    const updatedItems = this.itemsMoveDown(applicationsToUpdate);

    // update the current application to its new desired position
    desiredApplication.statusDisplayPosition = desiredPosition;

    updatedItems.push(desiredApplication);
    return updatedItems;
  }

  public applicationMoveDown(data: ApplicationToMove): JobApplicationEntity[] {
    const { desiredApplication, desiredPosition, applications } = data;
    this.checkReorderPosibility(desiredPosition, applications.length);
    const currentPosition = desiredApplication.statusDisplayPosition;

    const applicationsToUpdate = applications.filter(
      (a) => a.statusDisplayPosition > currentPosition && a.statusDisplayPosition <= desiredPosition
    );

    const updatedItems = this.itemsMoveUp(applicationsToUpdate);

    desiredApplication.statusDisplayPosition = desiredPosition;

    updatedItems.push(desiredApplication);
    return updatedItems;
  }

  public applicationArchive(data: ApplicationArchive): JobApplicationEntity[] {
    const { applications, desiredApplication, archiveStatus } = data;
    const currentPosition = desiredApplication.statusDisplayPosition;

    const sourceItemsToUpdate = applications.filter(
      (a) => a.status.id === desiredApplication.status.id && a.statusDisplayPosition > currentPosition
    );

    const archivedItems = applications.filter((a) => a.status.id === archiveStatus.id);

    const updatedItems = this.itemsMoveUp(sourceItemsToUpdate);

    desiredApplication.status = archiveStatus;
    desiredApplication.statusDisplayPosition = archivedItems.length;

    updatedItems.push(desiredApplication);
    return updatedItems;
  }

  public applicationStatusChange(data: ApplicationStatusChange): JobApplicationEntity[] {
    const { desiredApplication, desiredPosition, desiredStatus, applications } = data;
    const desiredStatusId = desiredStatus.id;

    const currentPosition = desiredApplication.statusDisplayPosition;

    // items that have to move up
    const sourceItemsToUpdate = applications.filter(
      (a) => a.status.id === desiredApplication.status.id && a.statusDisplayPosition > currentPosition
    );

    const destinationItems = applications.filter((a) => a.status.id === desiredStatusId);
    // items that have to move down
    const destinationItemsToUpdate = destinationItems.filter(
      (a) => a.statusDisplayPosition >= desiredPosition
    );

    this.checkInsertPosibility(desiredPosition, destinationItems.length);

    const updatedSource = this.itemsMoveUp(sourceItemsToUpdate);
    const updatedDestination = this.itemsMoveDown(destinationItemsToUpdate);

    desiredApplication.statusDisplayPosition = desiredPosition;
    desiredApplication.status = desiredStatus;

    updatedDestination.push(desiredApplication);
    return updatedSource.concat(updatedDestination);
  }

  private itemsMoveUp(items: JobApplicationEntity[]): JobApplicationEntity[] {
    return items.map((i) => {
      return {
        ...i,
        statusDisplayPosition: i.statusDisplayPosition - 1
      } as JobApplicationEntity;
    });
  }

  private itemsMoveDown(items: JobApplicationEntity[]): JobApplicationEntity[] {
    return items.map((i) => {
      return {
        ...i,
        statusDisplayPosition: i.statusDisplayPosition + 1
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
