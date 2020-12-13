import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StatusEntity } from '../shared/entities/status.entity';
import { StatusService } from './status.service';

@Controller('status')
@ApiTags('status')
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @Get('/')
  public async findAll(): Promise<StatusEntity[]> {
    return this.statusService.findAll();
  }
}
