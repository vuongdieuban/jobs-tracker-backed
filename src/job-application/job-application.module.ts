import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatusEntity } from 'src/status/entities/status.entity';
import { JobPostEntity } from 'src/job-post/entities/job-post.entity';
import { SharedModule } from 'src/shared/shared.module';
import { UserEntity } from 'src/user/entities/user.entity';
import { JobApplicationEntity } from './entities/job-application.entity';
import { JobApplicationController } from './job-application.controller';
import { JobApplicationService } from './job-application.service';
import { JobApplicationPublisher, JobApplicationSubscriber } from './pubsub';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobApplicationEntity, StatusEntity, UserEntity, JobPostEntity]),
    SharedModule,
  ],
  controllers: [JobApplicationController],
  providers: [JobApplicationService, JobApplicationPublisher, JobApplicationSubscriber],
  exports: [JobApplicationPublisher],
})
export class JobApplicationModule {}
