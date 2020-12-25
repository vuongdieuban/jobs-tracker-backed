import { Connection, EntitySubscriberInterface, EventSubscriber, UpdateEvent } from 'typeorm';
import { JobApplicationEntity } from 'src/job-application/entities/job-application.entity';
import { Subject } from 'rxjs';

@EventSubscriber()
export class JobApplicationSubscriber implements EntitySubscriberInterface<JobApplicationEntity> {
  private readonly source = new Subject<JobApplicationEntity>();

  get data$() {
    return this.source.asObservable();
  }

  constructor(connection: Connection) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return JobApplicationEntity;
  }

  afterUpdate(event: UpdateEvent<JobApplicationEntity>) {
    console.log('After Application Update: ', event.entity);
    console.log('Updated column', event.updatedColumns);
    console.log('Updated relations', event.updatedRelations);
    this.source.next(event.entity);
  }
}
