import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';

export class ReorderApplicationDto {
  @ApiProperty()
  @IsString()
  @IsDefined()
  readonly front: string;
}
