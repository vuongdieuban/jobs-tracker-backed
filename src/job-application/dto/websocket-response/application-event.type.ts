import { ApplicationReorderedEvent } from './reordered-event.dto';
import { ApplicationStatusChangedEvent } from './status-changed-event.dto';

export type ApplicationEvent = ApplicationReorderedEvent | ApplicationStatusChangedEvent;
