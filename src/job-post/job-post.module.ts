import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobPostEntity } from './entities/job-post.entity';
import { JobPostController } from './job-post.controller';
import { JobPostService } from './job-post.service';

@Module({
  imports: [TypeOrmModule.forFeature([JobPostEntity])],
  controllers: [JobPostController],
  providers: [JobPostService],

})
export class JobPostModule { }
