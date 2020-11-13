import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobApplicationStatusEntity } from 'src/shared/entities/job-application-status.entity';
import { JobPostEntity } from 'src/shared/entities/job-post.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { JobApplicationEntity } from '../shared/entities/job-application.entity';
import { JobApplicationEventsPublisher } from './job-application-events-publisher.service';
import { JobApplicationController } from './job-application.controller';
import { JobApplicationService } from './job-application.service';
import { ReorderApplicationsService } from './reorder-applications.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobApplicationEntity, JobApplicationStatusEntity, UserEntity, JobPostEntity]),
  ],
  controllers: [JobApplicationController],
  providers: [JobApplicationService, ReorderApplicationsService, JobApplicationEventsPublisher],
  exports: [JobApplicationEventsPublisher],
})
export class JobApplicationModule {}
