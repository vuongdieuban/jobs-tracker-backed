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

  public async getAll(): Promise<JobApplicationEntity[]> {
    return this.jobApplicationRepo.find({ relations: ['status', 'jobPost'] });
  }

  public async reorder(applicationId: string, reorderDto: ReorderApplicationDto): Promise<any> {
    console.log('reorder', applicationId);
    const { position: desiredPosition, statusId } = reorderDto;

    const application = await this.jobApplicationRepo.findOne(applicationId, {
      relations: ['status']
    });

    if (!application) {
      throw new NotFoundException(`Application with id ${applicationId} not found`);
    }

    if (application.status.id !== statusId) {
      console.log('item inserted');
      return this.itemInsertedIntoList(application, desiredPosition, statusId);
    }

    if (desiredPosition > application.statusDisplayPosition) {
      console.log('item move down');
      return this.itemMoveDown(application, desiredPosition);
    } else {
      console.log('item move up');
      return this.itemMoveUp(application, desiredPosition);
    }
  }

  private async itemMoveUp(application: JobApplicationEntity, desiredPosition: number) {
    console.log('item move up', application);
    const statusId = application.status.id;
    const currentPosition = application.statusDisplayPosition;
    const items = await this.jobApplicationRepo.find({
      relations: ['status'],
      where: { status: { id: statusId } }
    });

    const itemsToUpdate = items.filter(
      (i) => i.statusDisplayPosition >= desiredPosition && i.statusDisplayPosition < currentPosition
    );

    const updatedItems = itemsToUpdate.map((i) => ({
      ...i,
      statusDisplayPosition: i.statusDisplayPosition + 1
    }));

    application.statusDisplayPosition = desiredPosition;

    updatedItems.push(application);
    await this.jobApplicationRepo.save(updatedItems);
    console.log('got here', updatedItems);
    return {
      applicationId: application.id,
      statusId: application.status.id,
      statusDisplayPosition: application.statusDisplayPosition
    };
  }

  private async itemMoveDown(application: JobApplicationEntity, desiredPosition: number) {}

  private async itemInsertedIntoList(
    application: JobApplicationEntity,
    desiredPosition: number,
    updatedStatus: string
  ) {}
}
