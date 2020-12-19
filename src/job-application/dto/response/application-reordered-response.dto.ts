import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDefined, IsNumber } from 'class-validator';

export class ApplicationReorderedResponseDto {
  @ApiProperty()
  @IsString()
  @IsDefined()
  readonly id: string;

  @ApiProperty()
  @IsNumber()
  @IsDefined()
  readonly position: number;

  @ApiProperty()
  @IsString()
  @IsDefined()
  readonly statusId: string;
}
