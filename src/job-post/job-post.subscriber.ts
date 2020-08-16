import { Injectable } from '@nestjs/common';
import { Connection, EntitySubscriberInterface, EventSubscriber, InsertEvent } from 'typeorm';
import { JobPostEntity } from './entities/job-post.entity';
import { JobPostStateService } from './job-post-state.service';

@Injectable()
@EventSubscriber()
export class JobPostSubscriber implements EntitySubscriberInterface<JobPostEntity> {

  constructor(
    private readonly connection: Connection,
    private readonly jobstate: JobPostStateService
  ) {
    // this allow dependency injection into EnitySubscriber.
    // Register subscribers into subscribers array in typeorm config in database-connection.service doesn't allow dependency injection
    // https://stackoverflow.com/questions/58918644/nestjs-cannot-inject-a-service-into-a-subscriber
    this.connection.subscribers.push(this);
  }

  listenTo() {
    return JobPostEntity;
  }

  afterInsert(event: InsertEvent<JobPostEntity>): Promise<any> | void {
    this.jobstate.updateData('def');
    return;
  }
}