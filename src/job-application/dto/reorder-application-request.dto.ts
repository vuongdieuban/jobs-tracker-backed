import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNumber, IsString } from 'class-validator';

export class ReorderApplicationRequestDto {
  @ApiProperty({ description: 'updated display position for application status' })
  @IsNumber()
  @IsDefined()
  readonly position: number;

  @ApiProperty()
  @IsString()
  @IsDefined()
  readonly statusId: string;
}
