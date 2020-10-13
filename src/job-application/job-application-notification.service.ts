import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';
import { ApplicationUpdatedResponseDto } from './dto/application-updated-response.dto';

@Injectable()
export class JobApplicationNotificationService {
  private readonly source = new Subject<ApplicationUpdatedResponseDto>();

  get data$() {
    return this.source.asObservable();
  }

  updateData(data: ApplicationUpdatedResponseDto) {
    this.source.next(data);
  }
}
