import { Connection, EntitySubscriberInterface, EventSubscriber, InsertEvent } from 'typeorm';
import { JobApplicationEntity } from 'src/job-application/entities/job-application.entity';

@EventSubscriber()
export class JobApplicationSubscriber implements EntitySubscriberInterface<JobApplicationEntity> {
  constructor(connection: Connection) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return JobApplicationEntity;
  }

  afterUpdate(event: InsertEvent<JobApplicationEntity>) {
    console.log('After Application Update: ', event.entity);
  }
}
