import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';

export class ReorderApplicationDto {
  @ApiProperty({ description: 'updated display position for application status' })
  @IsString()
  @IsDefined()
  readonly position: number;

  @ApiProperty()
  @IsString()
  @IsDefined()
  readonly statusId: string;
}
