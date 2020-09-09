import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNumber, IsString } from 'class-validator';

export class ApplicationUpdatedResponseDto {
  @ApiProperty()
  @IsNumber()
  @IsDefined()
  readonly position: number;

  @ApiProperty()
  @IsString()
  @IsDefined()
  readonly statusId: string;

  @ApiProperty()
  @IsString()
  @IsDefined()
  readonly applicationId: string;
}
