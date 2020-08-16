import { Injectable, Logger } from '@nestjs/common';
import { JobPostStateService } from './job-post/job-post-state.service';

@Injectable()
export class AppService {

  private readonly logger: Logger = new Logger('AppService');

  constructor(private readonly jobState: JobPostStateService) {
    this.jobState.data$.subscribe((data) => {
      this.logger.log(`JobState in App Service: ${data}`);
    });
  }
}
