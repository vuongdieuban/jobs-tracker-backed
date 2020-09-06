import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JobApplicationStatusEntity } from 'src/job-application-status/entities/job-application-status.entity';
import { Repository } from 'typeorm';
import { ReorderApplicationRequestDto } from './dto/reorder-application-request.dto';
import { ReorderApplicationResponseDto } from './dto/reorder-application-response.dto';
import { JobApplicationEntity } from './entities/job-application.entity';

@Injectable()
export class JobApplicationService {
  constructor(
    @InjectRepository(JobApplicationEntity)
    private readonly jobApplicationRepo: Repository<JobApplicationEntity>,
    @InjectRepository(JobApplicationStatusEntity)
    private readonly applicationStatusRepo: Repository<JobApplicationStatusEntity>
  ) {}

  public async getAll(): Promise<JobApplicationEntity[]> {
    return this.jobApplicationRepo.find({ relations: ['status', 'jobPost'] });
  }

  public async reorder(
    applicationId: string,
    reorderDto: ReorderApplicationRequestDto
  ): Promise<ReorderApplicationResponseDto> {
    const { position: desiredPosition, statusId } = reorderDto;

    const status = await this.applicationStatusRepo.findOneOrFail(statusId).catch((e) => {
      throw new NotFoundException(`Status with id ${applicationId} not found`);
    });

    const application = await this.jobApplicationRepo
      .findOneOrFail(applicationId, {
        relations: ['status']
      })
      .catch((e) => {
        throw new NotFoundException(`Application with id ${applicationId} not found`);
      });

    const { statusDisplayPosition: currentPosition } = application;
    const { id: currentStatus } = application.status;
    if (currentPosition === desiredPosition && currentStatus === statusId) {
      return {
        applicationId: application.id,
        statusId: currentStatus,
        position: currentPosition
      };
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

  private async itemMoveUp(
    application: JobApplicationEntity,
    desiredPosition: number
  ): Promise<ReorderApplicationResponseDto> {
    const statusId = application.status.id;
    const currentPosition = application.statusDisplayPosition;
    const items = await this.jobApplicationRepo.find({
      relations: ['status'],
      where: { status: { id: statusId } }
    });

    // Get all the items between current position and desired position
    const itemsToUpdate = items.filter(
      (i) => i.statusDisplayPosition >= desiredPosition && i.statusDisplayPosition < currentPosition
    );

    // Increment position by 1 because all those items are moving down
    const updatedItems = itemsToUpdate.map((i) => ({
      ...i,
      statusDisplayPosition: i.statusDisplayPosition + 1
    }));

    // update the current application to its new desired position
    application.statusDisplayPosition = desiredPosition;

    updatedItems.push(application);
    await this.jobApplicationRepo.save(updatedItems);

    return {
      applicationId: application.id,
      statusId: application.status.id,
      position: application.statusDisplayPosition
    };
  }

  private async itemMoveDown(
    application: JobApplicationEntity,
    desiredPosition: number
  ): Promise<ReorderApplicationResponseDto> {
    return;
  }

  private async itemInsertedIntoList(
    application: JobApplicationEntity,
    desiredPosition: number,
    updatedStatus: string
  ): Promise<ReorderApplicationResponseDto> {
    return;
  }
}
