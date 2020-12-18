import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString, ValidateNested } from 'class-validator';

export class ReorderApplicationRequestDto {
  @ApiProperty({
    description:
      'Updated display position for application status. \
       If blank then will automatically be assigned to current array length (aka bottom position)',
  })
  @ValidateNested()
  readonly position: 'top' | 'bottom' | number;

  @ApiProperty()
  @IsString()
  @IsDefined()
  readonly statusId: string;
}
