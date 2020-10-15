import { ApplicationEventName } from 'src/job-application/constants/application-event-name.enum';

export interface StatusChangedEventPayload {
  applicationId: string;
  previousStatusId: string;
  updatedStatusId: string;
  updatedPosition: number;
}

export interface ApplicationStatusChangedEvent {
  event: ApplicationEventName.STATUS_CHANGED;
  payload: StatusChangedEventPayload;
}
