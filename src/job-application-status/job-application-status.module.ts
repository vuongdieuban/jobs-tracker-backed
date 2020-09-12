import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobApplicationStatusEntity } from './entities/job-application-status.entity';
import { JobApplicationStatusController } from './job-application-status.controller';
import { JobApplicationStatusService } from './job-application-status.service';

@Module({
  imports: [TypeOrmModule.forFeature([JobApplicationStatusEntity])],
  controllers: [JobApplicationStatusController],
  providers: [JobApplicationStatusService],
  exports: []
})
export class JobApplicationStatusModule {}
