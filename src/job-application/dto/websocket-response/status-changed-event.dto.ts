import { ApplicationEventName } from 'src/job-application/constants/application-event-name.enum';
import { BaseEventPayload } from './base-event-payload.dto';

export interface StatusChangedEventPayload extends BaseEventPayload {
  previousStatusId: string;
  updatedStatusId: string;
  position: number;
}

export interface ApplicationStatusChangedEvent {
  event: ApplicationEventName.STATUS_CHANGED;
  payload: StatusChangedEventPayload;
}
