import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobApplicationStatusEntity } from 'src/job-application-status/entities/job-application-status.entity';
import { JobApplicationStatusModule } from 'src/job-application-status/job-application-status.module';
import { JobApplicationEntity } from './entities/job-application.entity';
import { JobApplicationController } from './job-application.controller';
import { JobApplicationService } from './job-application.service';

@Module({
  imports: [TypeOrmModule.forFeature([JobApplicationEntity, JobApplicationStatusEntity])],
  controllers: [JobApplicationController],
  providers: [JobApplicationService],
  exports: []
})
export class JobApplicationModule {}
