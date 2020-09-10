import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobApplicationStatusEntity } from 'src/job-application-status/entities/job-application-status.entity';
import { JobApplicationStatusModule } from 'src/job-application-status/job-application-status.module';
import { JobPostEntity } from 'src/job-post/entities/job-post.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { JobApplicationEntity } from './entities/job-application.entity';
import { JobApplicationController } from './job-application.controller';
import { JobApplicationService } from './job-application.service';
import { ReorderApplicationsService } from './reorder-applications.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([JobApplicationEntity, JobApplicationStatusEntity, UserEntity, JobPostEntity])
  ],
  controllers: [JobApplicationController],
  providers: [JobApplicationService, ReorderApplicationsService],
  exports: []
})
export class JobApplicationModule {}
