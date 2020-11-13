import { ApplicationEventName } from 'src/job-application/constants/application-event-name.enum';
import { JobPostEntity } from 'src/shared/entities/job-post.entity';
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
