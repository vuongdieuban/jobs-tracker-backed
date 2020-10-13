import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobApplicationStatusEntity } from 'src/job-application-status/entities/job-application-status.entity';
import { JobPostEntity } from 'src/job-post/entities/job-post.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { JobApplicationEntity } from './entities/job-application.entity';
import { JobApplicationNotificationService } from './job-application-notification.service';
import { JobApplicationController } from './job-application.controller';
import { JobApplicationService } from './job-application.service';
import { JobApplicationSubscriber } from './job-application.subscriber';
import { ReorderApplicationsService } from './reorder-applications.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobApplicationEntity, JobApplicationStatusEntity, UserEntity, JobPostEntity])
  ],
  controllers: [JobApplicationController],
  providers: [
    JobApplicationService,
    ReorderApplicationsService,
    JobApplicationNotificationService,
    JobApplicationSubscriber
  ],
  exports: [JobApplicationNotificationService]
})
export class JobApplicationModule {}
