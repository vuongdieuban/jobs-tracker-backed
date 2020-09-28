import { BadGatewayException, BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JobApplicationStatusEntity } from 'src/job-application-status/entities/job-application-status.entity';
import { JobPostEntity } from 'src/job-post/entities/job-post.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';
import { ApplicationUpdatedResponseDto } from './dto/application-updated-response.dto';
import { CreateApplicationRequestDto } from './dto/create-application-request.dto';
import { ReorderApplicationRequestDto } from './dto/reorder-application-request.dto';
import { JobApplicationEntity } from './entities/job-application.entity';
import { ReorderApplicationsService } from './reorder-applications.service';

@Injectable()
export class JobApplicationService {
  constructor(
    private readonly reorderService: ReorderApplicationsService,
    @InjectRepository(JobApplicationEntity)
    private readonly jobApplicationRepo: Repository<JobApplicationEntity>,
    @InjectRepository(JobApplicationStatusEntity)
    private readonly applicationStatusRepo: Repository<JobApplicationStatusEntity>,
    @InjectRepository(JobPostEntity)
    private readonly jobPostReo: Repository<JobPostEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>
  ) {}

  public async findAll(): Promise<JobApplicationEntity[]> {
    const applications = await this.getAllApplications();
    return applications.map((a) => this.parseFullApplicationResponse(a));
  }

  public async create(payload: CreateApplicationRequestDto): Promise<JobApplicationEntity> {
    try {
      const { jobPostId, statusId, userId } = payload;
      const jobPostPromise = this.jobPostReo.findOneOrFail(jobPostId, { relations: ['platform'] });
      const userPromise = this.userRepo.findOneOrFail(userId);
      const statusPromise = this.applicationStatusRepo.findOneOrFail(statusId, {
        relations: ['jobApplications']
      });
      const [jobPost, status, user] = await Promise.all([jobPostPromise, statusPromise, userPromise]);

      const application = new JobApplicationEntity();
      application.jobPost = jobPost;
      application.status = status;
      application.user = user;

      application.statusDisplayPosition = status.jobApplications.length;

      const createdApplication = await application.save();
      return this.parseFullApplicationResponse(createdApplication);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException(error.message);
      } else if (error instanceof QueryFailedError) {
        throw new BadRequestException(error.message);
      } else {
        throw new BadGatewayException(error.message);
      }
    }
  }

  public async archive(applicationId: string): Promise<ApplicationUpdatedResponseDto> {
    const statusPromise = this.applicationStatusRepo.findOneOrFail({
      where: { name: 'Archive' }
    });

    const [applications, desiredApplication, archiveStatus] = await Promise.all([
      this.getAllApplications(),
      this.getApplicationById(applicationId),
      statusPromise
    ]);

    const updatedApplications = this.reorderService.applicationArchive({
      desiredApplication,
      applications,
      archiveStatus
    });

    return this.saveReorderedApplications(applicationId, updatedApplications);
  }

  public async reorder(
    applicationId: string,
    reorderDto: ReorderApplicationRequestDto
  ): Promise<ApplicationUpdatedResponseDto> {
    let { position: desiredPosition } = reorderDto;
    const { statusId: desiredStatusId } = reorderDto;

    const status = await this.applicationStatusRepo
      .findOneOrFail(desiredStatusId, { relations: ['jobApplications'] })
      .catch((e) => {
        throw new NotFoundException(`Status with id ${applicationId} not found`);
      });

    const application = await this.getApplicationById(applicationId);

    desiredPosition = desiredPosition === undefined ? status.jobApplications.length : desiredPosition;

    const { statusDisplayPosition: currentPosition } = application;
    const { id: currentStatus } = application.status;
    if (currentPosition === desiredPosition && currentStatus === desiredStatusId) {
      return this.parseApplicationUpdatedResponse(application);
    }

    return this.moveApplication(application, status, desiredPosition);
  }

  private async moveApplication(
    application: JobApplicationEntity,
    desiredStatus: JobApplicationStatusEntity,
    desiredPosition: number
  ): Promise<ApplicationUpdatedResponseDto> {
    if (application.status.id !== desiredStatus.id) {
      console.log('item inserted');
      return this.applicationStatusChange(application, desiredStatus, desiredPosition);
    }

    if (desiredPosition > application.statusDisplayPosition) {
      console.log('item move down');
      return this.applicationMoveDown(application, desiredPosition);
    } else {
      console.log('item move up');
      return this.applicationMoveUp(application, desiredPosition);
    }
  }

  private async applicationMoveUp(
    application: JobApplicationEntity,
    desiredPosition: number
  ): Promise<ApplicationUpdatedResponseDto> {
    const applications = await this.getApplicationsByStatusId(application.status.id);
    const reorderedApplications = this.reorderService.applicationMoveUp({
      desiredPosition,
      applications,
      desiredApplication: application
    });
    return this.saveReorderedApplications(application.id, reorderedApplications);
  }

  private async applicationMoveDown(
    application: JobApplicationEntity,
    desiredPosition: number
  ): Promise<ApplicationUpdatedResponseDto> {
    const applications = await this.getApplicationsByStatusId(application.status.id);
    const reorderedApplications = this.reorderService.applicationMoveDown({
      desiredPosition,
      applications,
      desiredApplication: application
    });
    return this.saveReorderedApplications(application.id, reorderedApplications);
  }

  private async applicationStatusChange(
    application: JobApplicationEntity,
    desiredStatus: JobApplicationStatusEntity,
    desiredPosition: number
  ): Promise<ApplicationUpdatedResponseDto> {
    const applications = await this.getAllApplications();

    const reorderedApplications = this.reorderService.applicationStatusChange({
      desiredPosition,
      desiredStatus,
      applications,
      desiredApplication: application
    });

    return this.saveReorderedApplications(application.id, reorderedApplications);
  }

  private getApplicationsByStatusId(statusId: string): Promise<JobApplicationEntity[]> {
    return this.jobApplicationRepo.find({
      relations: ['status', 'jobPost', 'jobPost.platform', 'user'],
      where: { status: { id: statusId } }
    });
  }

  private async getApplicationById(applicationId: string): Promise<JobApplicationEntity> {
    return this.jobApplicationRepo
      .findOneOrFail(applicationId, {
        relations: ['status', 'jobPost', 'jobPost.platform', 'user']
      })
      .catch((e) => {
        throw new NotFoundException(`Application with id ${applicationId} not found`);
      });
  }

  private async getAllApplications(): Promise<JobApplicationEntity[]> {
    return this.jobApplicationRepo.find({
      relations: ['status', 'jobPost', 'jobPost.platform', 'user']
    });
  }

  private async saveReorderedApplications(
    desiredApplicationId: string,
    updatedApplications: JobApplicationEntity[]
  ): Promise<ApplicationUpdatedResponseDto> {
    const updatedData = await this.jobApplicationRepo.save(updatedApplications);
    const application = updatedData.find((a) => a.id === desiredApplicationId);
    return this.parseApplicationUpdatedResponse(application);
  }

  private parseApplicationUpdatedResponse(application: JobApplicationEntity): ApplicationUpdatedResponseDto {
    return {
      id: application.id,
      statusId: application.status.id,
      statusDisplayPosition: application.statusDisplayPosition,
      jobPostId: application.jobPost.id,
      userId: application.user.id
    };
  }

  private parseFullApplicationResponse(application: JobApplicationEntity): JobApplicationEntity {
    delete application.status?.jobApplications;
    delete application.user.email;
    return application;
  }
}
