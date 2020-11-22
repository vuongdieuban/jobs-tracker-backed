import { Injectable } from '@nestjs/common';

interface Application {
  id: number;
  pos: number;
}

const applications: Application[] = [
  { id: 1, pos: 32767 },
  { id: 2, pos: 49151.5 },
  { id: 3, pos: 49151.6 },
  { id: 4, pos: 90000 },
  { id: 5, pos: 129000 },
];

const itemToMove: Application = {
  id: 5,
  pos: 60000,
};

const SPACE_BETWEEN_ITEM = Math.pow(2, 14);
const MIN_SPACE_BETWEEN_ITEM = 0.15;

@Injectable()
export class ReorderPositionService {
  moveApplicationInSameList() {
    const { pos, id } = itemToMove;

    const application = applications.find(app => app.id === id);
    if (!application) {
      throw Error(`No application found with id ${id}`);
    }

    // temporary update with data sent in from the front-end
    application.pos = pos;

    // sort again so we know where it will be
    applications.sort((a, b) => a.pos - b.pos);

    // index after sort
    const insertIndex = applications.findIndex(app => app.id === id);

    const updatedApplications = this.calculateApplicationsPositionAfterInsertion(applications, insertIndex);
    console.log('Applications reordered', applications);
    console.log('updatedApplications', updatedApplications);
  }

  calculateApplicationsPositionAfterInsertion(
    applications: Application[],
    insertIndex: number,
  ): Application[] {
    const updatedApplications: Application[] = [];
    for (let i = insertIndex; i < applications.length; i++) {
      const application = applications[i];
      const applicationBehind = applications[i - 1];
      const applicationAhead = applications[i + 1];

      const positionBehind = applicationBehind ? applicationBehind.pos : 0;

      if (!applicationAhead) {
        // last item in the list
        application.pos = positionBehind + SPACE_BETWEEN_ITEM;
        updatedApplications.push(application);
        return updatedApplications;
      }

      const positionAhead = applicationAhead.pos;
      const spaceBetween = positionAhead - positionBehind;

      // if space between two items are more than MIN_SPACE_BETWEEN_ITEM then we can just insert between them
      // Otherwise the space is too small between them so we increment the space, keep increment them until they are large enough.
      if (spaceBetween > MIN_SPACE_BETWEEN_ITEM) {
        application.pos = (positionAhead + positionBehind) / 2;
        updatedApplications.push(application);
        return updatedApplications;
      }

      application.pos = positionBehind + SPACE_BETWEEN_ITEM;
      updatedApplications.push(application);
    }
    return updatedApplications;
  }
}
