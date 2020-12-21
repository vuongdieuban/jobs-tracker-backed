import { ApplicationEventName } from 'src/job-application/pubsub';
import { JobPostEntity } from 'src/job-post/entities/job-post.entity';
import { BaseEventPayload } from './base-event-payload.dto';

export interface CreatedEventPayload extends BaseEventPayload {
  statusId: string;
  jobPost: JobPostEntity;
  position: number;
}

export interface ApplicationCreatedEvent {
  event: ApplicationEventName.CREATED;
  payload: CreatedEventPayload;
}
