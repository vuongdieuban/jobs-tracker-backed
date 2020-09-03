import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobApplicationEntity } from './entities/job-application.entity';

@Module({
  imports: [TypeOrmModule.forFeature([JobApplicationEntity])],
  controllers: [],
  providers: [],
  exports: []
})
export class JobApplicationModule {}
