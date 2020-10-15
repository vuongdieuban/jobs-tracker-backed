import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';
import { ApplicationEventName } from './constants/application-event-name.enum';
import { ApplicationEvent } from './dto/websocket-response/application-event.type';
import { ApplicationReorderedEvent } from './dto/websocket-response/reordered-event.dto';
import { ApplicationStatusChangedEvent } from './dto/websocket-response/status-changed-event.dto';
import { JobApplicationEntity } from './entities/job-application.entity';

@Injectable()
export class JobApplicationEventsPublisher {
  private readonly source = new Subject<ApplicationEvent>();

  get data$() {
    return this.source.asObservable();
  }

  public applicationReordered(application: JobApplicationEntity): void {
    const data: ApplicationReorderedEvent = {
      event: ApplicationEventName.REORDERED,
      payload: {
        applicationId: application.id,
        statusId: application.status.id,
        updatedPosition: application.statusDisplayPosition
      }
    };
    this.publish(data);
  }

  public applicationStatusChanged(previousStatusId: string, application: JobApplicationEntity): void {
    const data: ApplicationStatusChangedEvent = {
      event: ApplicationEventName.STATUS_CHANGED,
      payload: {
        applicationId: application.id,
        updatedStatusId: application.status.id,
        updatedPosition: application.statusDisplayPosition,
        previousStatusId
      }
    };
    this.publish(data);
  }

  public applicationArchived(application: JobApplicationEntity): void {}

  private publish(data: ApplicationEvent): void {
    this.source.next(data);
  }
}
