import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDefined, IsString } from 'class-validator';

export class ApplicationArchivedResponseDto {
  @ApiProperty()
  @IsString()
  @IsDefined()
  readonly id: string;

  @ApiProperty()
  @IsBoolean()
  @IsDefined()
  readonly archived: boolean;
}
