import { ApplicationEventName } from 'src/job-application/constants/application-event-name.enum';
import { BaseEventPayload } from './base-event-payload.dto';

export interface ReorderedEventPayload extends BaseEventPayload {
  statusId: string;
  position: number;
}

export interface ApplicationReorderedEvent {
  event: ApplicationEventName.REORDERED;
  payload: ReorderedEventPayload;
}
