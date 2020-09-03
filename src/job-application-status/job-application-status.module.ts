import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobApplicationStatusEntity } from './entities/job-application-status.entity';

@Module({
  imports: [TypeOrmModule.forFeature([JobApplicationStatusEntity])],
  controllers: [],
  providers: [],
  exports: []
})
export class JobApplicationStatusModule {}
