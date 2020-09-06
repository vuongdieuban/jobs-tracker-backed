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
      return this.itemInsertedIntoList(application, desiredPosition, statusId);
    }

    if (desiredPosition > application.statusDisplayPosition) {
      return this.itemMoveDown(application, desiredPosition);
    } else {
      return this.itemMoveUp(application, desiredPosition);
    }
  }

  private async itemMoveUp(application: JobApplicationEntity, desiredPosition: number) {}

  private async itemMoveDown(application: JobApplicationEntity, desiredPosition: number) {}

  private async itemInsertedIntoList(
    application: JobApplicationEntity,
    desiredPosition: number,
    updatedStatus: string
  ) {}
}
