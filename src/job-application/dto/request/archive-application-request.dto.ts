import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDefined } from 'class-validator';

export class ArchiveApplicationRequestDto {
  @ApiProperty()
  @IsBoolean()
  @IsDefined()
  readonly archive: boolean;
}
