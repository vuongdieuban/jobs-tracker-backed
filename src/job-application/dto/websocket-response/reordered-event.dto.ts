import { ApplicationEventName } from 'src/job-application/constants/application-event-name.enum';

export interface ReorderedEventPayload {
  applicationId: string;
  statusId: string;
  updatedPosition: number;
}

export interface ApplicationReorderedEvent {
  event: ApplicationEventName.REORDERED;
  payload: ReorderedEventPayload;
}
