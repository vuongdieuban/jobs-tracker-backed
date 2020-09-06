import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobApplicationEntity } from './entities/job-application.entity';
import { JobApplicationController } from './job-application.controller';
import { JobApplicationService } from './job-application.service';

@Module({
  imports: [TypeOrmModule.forFeature([JobApplicationEntity])],
  controllers: [JobApplicationController],
  providers: [JobApplicationService],
  exports: []
})
export class JobApplicationModule {}
