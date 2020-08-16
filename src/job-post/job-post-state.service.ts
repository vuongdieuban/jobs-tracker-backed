import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

@Injectable()
export class JobPostStateService {

  private readonly source = new Subject<string>();

  get data$() {
    return this.source.asObservable();
  }

  updateData(data: string) {
    this.source.next(data);
  }
}
