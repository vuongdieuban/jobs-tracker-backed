import { Injectable, NotFoundException } from '@nestjs/common';
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

  public async reorder(applicationId: string, reorderDto: ReorderApplicationDto): Promise<any> {
    const { position: desiredPosition, statusId } = reorderDto;

    const application = await this.jobApplicationRepo.findOne(applicationId);
    if (!application) {
      throw new NotFoundException(`Application with id ${applicationId} not found`);
    }

    if (application.status.id !== statusId) {
      return this.itemInsertedIntoList();
    }

    if (desiredPosition > application.statusPosition) {
      return this.itemMoveDown();
    } else {
      return this.itemMoveUp();
    }
  }

  private async itemMoveUp() {}

  private async itemMoveDown() {}

  private async itemInsertedIntoList() {}
}
