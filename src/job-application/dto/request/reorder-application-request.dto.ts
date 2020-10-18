import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNumber, IsOptional, IsString } from 'class-validator';

export class ReorderApplicationRequestDto {
  @ApiProperty({
    description:
      'Updated display position for application status. If blank then will automatically be assigned to current array length (aka bottom position)'
  })
  @IsNumber()
  @IsOptional()
  readonly position?: number;

  @ApiProperty()
  @IsString()
  @IsDefined()
  readonly statusId: string;
}
