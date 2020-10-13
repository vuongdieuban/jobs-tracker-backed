import { Injectable } from '@nestjs/common';
import { Connection, EntitySubscriberInterface, EventSubscriber, InsertEvent } from 'typeorm';
import { ApplicationUpdatedResponseDto } from './dto/application-updated-response.dto';
import { JobApplicationEntity } from './entities/job-application.entity';
import { JobApplicationNotificationService } from './job-application-notification.service';

@Injectable()
@EventSubscriber()
export class JobApplicationSubscriber implements EntitySubscriberInterface<JobApplicationEntity> {
  constructor(
    private readonly connection: Connection,
    private readonly notificationService: JobApplicationNotificationService
  ) {
    // this allow dependency injection into EnitySubscriber.
    // Register subscribers into subscribers array in typeorm config in database-connection.service doesn't allow dependency injection
    // https://stackoverflow.com/questions/58918644/nestjs-cannot-inject-a-service-into-a-subscriber
    this.connection.subscribers.push(this);
  }

  listenTo() {
    return JobApplicationEntity;
  }

  afterInsert(event: InsertEvent<JobApplicationEntity>): void {
    this.publishUpdatedData(event.entity);
  }

  afterUpdate(event: InsertEvent<JobApplicationEntity>): void {
    this.publishUpdatedData(event.entity);
  }

  private publishUpdatedData(data: JobApplicationEntity): void {
    const response = this.mapDataToResponse(data);
    this.notificationService.updateData(response);
  }

  private mapDataToResponse(data: JobApplicationEntity): ApplicationUpdatedResponseDto {
    const response: ApplicationUpdatedResponseDto = {
      id: data.id,
      statusDisplayPosition: data.statusDisplayPosition,
      statusId: data.status.id,
      jobPostId: data.jobPost.id,
      userId: data.user.id
    };
    return response;
  }
}
