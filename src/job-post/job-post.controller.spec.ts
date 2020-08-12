import { Test, TestingModule } from '@nestjs/testing';
import { JobPostController } from './job-post.controller';

describe('JobPost Controller', () => {
  let controller: JobPostController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobPostController],
    }).compile();

    controller = module.get<JobPostController>(JobPostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
