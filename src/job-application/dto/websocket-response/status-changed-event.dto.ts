import { ApplicationEventName } from 'src/job-application/pubsub';
import { JobPostEntity } from 'src/job-post/entities/job-post.entity';
import { BaseEventPayload } from './base-event-payload.dto';

export interface StatusChangedEventPayload extends BaseEventPayload {
  previousStatusId: string;
  updatedStatusId: string;
  position: number;
  jobPost: JobPostEntity;
}

export interface ApplicationStatusChangedEvent {
  event: ApplicationEventName.STATUS_CHANGED;
  payload: StatusChangedEventPayload;
}
