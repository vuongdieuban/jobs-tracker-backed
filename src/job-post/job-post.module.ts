import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlatformEntity } from 'src/platform/entities/platform.entity';
import { JobPostEntity } from './entities/job-post.entity';
import { JobPostController } from './job-post.controller';
import { JobPostService } from './job-post.service';

@Module({
  imports: [TypeOrmModule.forFeature([JobPostEntity, PlatformEntity])],
  controllers: [JobPostController],
  providers: [JobPostService],
  exports: [],
})
export class JobPostModule {}
