import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PlatformEntity } from '../shared/entities/platform.entity';
import { PlatformService } from './platform.service';

@Controller('platform')
@ApiTags('platform')
export class PlatformController {
  constructor(private readonly platformService: PlatformService) {}

  @Get('/')
  public async findAll(): Promise<PlatformEntity[]> {
    return this.platformService.findAll();
  }
}
