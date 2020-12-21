import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatusEntity } from 'src/status/entities/status.entity';
import { JobPostEntity } from 'src/job-post/entities/job-post.entity';
import { SharedModule } from 'src/shared/shared.module';
import { UserEntity } from 'src/user/entities/user.entity';
import { JobApplicationEntity } from './entities/job-application.entity';
import { JobApplicationEventsPublisher } from './job-application-events-publisher.service';
import { JobApplicationController } from './job-application.controller';
import { JobApplicationService } from './job-application.service';
import { JobApplicationSubscriber } from './subscribers/job-application.subscriber';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobApplicationEntity, StatusEntity, UserEntity, JobPostEntity]),
    SharedModule,
  ],
  controllers: [JobApplicationController],
  providers: [JobApplicationService, JobApplicationEventsPublisher, JobApplicationSubscriber],
  exports: [JobApplicationEventsPublisher],
})
export class JobApplicationModule {}
