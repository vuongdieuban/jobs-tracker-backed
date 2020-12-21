import { ApplicationEventName } from 'src/job-application/pubsub';
import { JobPostEntity } from 'src/job-post/entities/job-post.entity';
import { BaseEventPayload } from './base-event-payload.dto';

export interface ReorderedEventPayload extends BaseEventPayload {
  statusId: string;
  position: number;
  jobPost: JobPostEntity;
}

export interface ApplicationReorderedEvent {
  event: ApplicationEventName.REORDERED;
  payload: ReorderedEventPayload;
}
