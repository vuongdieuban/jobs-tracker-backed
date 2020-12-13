import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatusEntity } from 'src/shared/entities/status.entity';
import { JobPostEntity } from 'src/shared/entities/job-post.entity';
import { SharedModule } from 'src/shared/shared.module';
import { UserEntity } from 'src/shared/entities/user.entity';
import { JobApplicationEntity } from '../shared/entities/job-application.entity';
import { JobApplicationEventsPublisher } from './job-application-events-publisher.service';
import { JobApplicationController } from './job-application.controller';
import { JobApplicationService } from './job-application.service';
import { ReorderApplicationsService } from './reorder-applications.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobApplicationEntity, StatusEntity, UserEntity, JobPostEntity]),
    SharedModule,
  ],
  controllers: [JobApplicationController],
  providers: [JobApplicationService, ReorderApplicationsService, JobApplicationEventsPublisher],
  exports: [JobApplicationEventsPublisher],
})
export class JobApplicationModule {}
