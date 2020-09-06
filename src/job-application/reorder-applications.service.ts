import { Injectable } from '@nestjs/common';
import { JobApplicationEntity } from './entities/job-application.entity';

export interface ReorderData {
  desiredPosition: number;
  desiredApplication: JobApplicationEntity;
  allApplications: JobApplicationEntity[];
}

@Injectable()
export class ReorderApplicationsService {
  // Return array of all applications that have been updated
  public applicationMoveUp(data: ReorderData): JobApplicationEntity[] {
    const { desiredApplication, desiredPosition, allApplications } = data;
    const currentPosition = desiredApplication.statusDisplayPosition;

    // Get all the items between current position and desired position
    const applicationsToUpdate = allApplications.filter(
      (a) => a.statusDisplayPosition >= desiredPosition && a.statusDisplayPosition < currentPosition
    );

    // Increment position by 1 because all those items are moving down
    const updatedItems = applicationsToUpdate.map((a) => {
      return {
        ...a,
        statusDisplayPosition: a.statusDisplayPosition + 1
      } as JobApplicationEntity;
    });

    // update the current application to its new desired position
    desiredApplication.statusDisplayPosition = desiredPosition;

    updatedItems.push(desiredApplication);
    return updatedItems;
  }

  public applicationMoveDown(data: ReorderData): JobApplicationEntity[] {
    const { desiredApplication, desiredPosition, allApplications } = data;
    const currentPosition = desiredApplication.statusDisplayPosition;

    const applicationsToUpdate = allApplications.filter(
      (a) => a.statusDisplayPosition > currentPosition && a.statusDisplayPosition <= desiredPosition
    );

    const updatedItems = applicationsToUpdate.map((a) => {
      return {
        ...a,
        statusDisplayPosition: a.statusDisplayPosition - 1
      } as JobApplicationEntity;
    });

    desiredApplication.statusDisplayPosition = desiredPosition;

    updatedItems.push(desiredApplication);
    return updatedItems;
  }
}
