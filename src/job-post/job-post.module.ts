import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlatformEntity } from 'src/platform/entities/platform.entity';
import { JobPostEntity } from './entities/job-post.entity';
import { JobPostStateService } from './job-post-state.service';
import { JobPostController } from './job-post.controller';
import { JobPostService } from './job-post.service';
import { JobPostSubscriber } from './job-post.subscriber';

@Module({
  imports: [TypeOrmModule.forFeature([JobPostEntity, PlatformEntity])],
  controllers: [JobPostController],
  providers: [JobPostService, JobPostStateService, JobPostSubscriber],
  exports: [JobPostStateService]
})
export class JobPostModule {}
