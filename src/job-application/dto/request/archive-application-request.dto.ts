import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';

export class ArchiveApplicationRequestDto {
  @ApiProperty()
  @IsString()
  @IsDefined()
  readonly archive: boolean;
}
