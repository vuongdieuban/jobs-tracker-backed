import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReorderApplicationDto } from './dto/reorder-application.dto';
import { JobApplicationEntity } from './entities/job-application.entity';

@Injectable()
export class JobApplicationService {
  constructor(
    @InjectRepository(JobApplicationEntity)
    private readonly jobApplicationRepo: Repository<JobApplicationEntity>
  ) {}

  public async reorder(applicationId: string, reorderDto: ReorderApplicationDto): Promise<string> {
    const { position, statusId } = reorderDto;

    const application = await this.jobApplicationRepo.findOne(applicationId);

    return 'ok';
  }

  private async itemMoveUp() {}

  private async itemMoveDown() {}

  private async itemInsertedIntoList() {}
}
