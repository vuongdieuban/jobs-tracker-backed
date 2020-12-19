import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString, Validate } from 'class-validator';
import { PositionOption } from 'src/job-application/types';
import { PositionValidator } from '../../validators';
export class ReorderApplicationRequestDto {
  @ApiProperty()
  @Validate(PositionValidator)
  readonly position: PositionOption;

  @ApiProperty()
  @IsString()
  @IsDefined()
  readonly statusId: string;
}
