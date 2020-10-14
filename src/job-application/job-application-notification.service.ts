import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';
import { ApplicationUpdatedResponseDto } from './dto/application-updated-response.dto';
import { JobApplicationEntity } from './entities/job-application.entity';

@Injectable()
export class JobApplicationNotificationService {
  private readonly source = new Subject<ApplicationUpdatedResponseDto>();

  get data$() {
    return this.source.asObservable();
  }

  publish(data: ApplicationUpdatedResponseDto) {
    this.source.next(data);
  }

  applicationReordered(application: JobApplicationEntity) {}

  applicationStatusChanged(application: JobApplicationEntity) {}

  applicationArchived(application: JobApplicationEntity) {}
}
