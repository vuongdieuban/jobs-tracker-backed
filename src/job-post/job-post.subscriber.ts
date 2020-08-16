import { EntitySubscriberInterface, EventSubscriber, InsertEvent } from 'typeorm';
import { JobPostEntity } from './entities/job-post.entity';

@EventSubscriber()
export class JobPostSubscriber implements EntitySubscriberInterface<JobPostEntity> {

  listenTo() {
    return JobPostEntity;
  }

  afterInsert(event: InsertEvent<JobPostEntity>): Promise<any> | void {
    // publish ot rabitmq or redis inserted event
    return;
  }
}