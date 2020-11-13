import { ApplicationEventName } from 'src/job-application/constants/application-event-name.enum';
import { JobPostEntity } from 'src/shared/entities/job-post.entity';
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
