import { BadRequestException, Injectable } from '@nestjs/common';
import { JobApplicationEntity } from './entities/job-application.entity';

interface ApplicationMoved {
  desiredPosition: number;
  desiredApplication: JobApplicationEntity;
  applications: JobApplicationEntity[];
}

interface ApplicationStatusChanged extends ApplicationMoved {
  desiredStatusId: string;
}

@Injectable()
export class ReorderApplicationsService {
  // Return array of all applications that have been updated
  // Desired application move up, other items in list move down
  public applicationMoveUp(data: ApplicationMoved): JobApplicationEntity[] {
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

  public applicationMoveDown(data: ApplicationMoved): JobApplicationEntity[] {
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

  public applicationStatusChanged(data: ApplicationStatusChanged): JobApplicationEntity[] {
    const { desiredApplication, desiredPosition, desiredStatusId, applications } = data;

    const currentPosition = desiredApplication.statusDisplayPosition;
    const desiredStatus = applications.find((a) => a.status.id === desiredStatusId).status;

    // everything has to move up
    const source = applications.filter(
      (a) => a.status.id === desiredApplication.status.id && a.statusDisplayPosition > currentPosition
    );
    // everythin has to move down
    const destination = applications.filter(
      (a) => a.status.id === desiredStatusId && a.statusDisplayPosition >= desiredPosition
    );

    // TODO ERROR: status of undefined for filter if destination has 0 length
    this.checkReorderPosibility(desiredPosition, destination.length);

    const updatedSource = this.itemsMoveUp(source);
    const updatedDestination = this.itemsMoveDown(destination);

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
    if (totalLength) {
      if (desiredPosition >= totalLength) {
        console.log('totalLength', totalLength);
        console.log('desiredPos', desiredPosition);
        throw new BadRequestException('Cannot move to unexisted order.');
      }
    } else {
      if (desiredPosition > 0) {
        throw new BadRequestException('Cannot move to unexisted order.');
      }
    }
  }
}
