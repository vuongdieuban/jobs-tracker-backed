import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDefined, IsNumber, IsString } from 'class-validator';

export class ApplicationUpdatedResponseDto {
  @ApiProperty()
  @IsString()
  @IsDefined()
  readonly id: string;

  @ApiProperty()
  @IsNumber()
  @IsDefined()
  readonly position: number;

  @ApiProperty()
  @IsBoolean()
  @IsDefined()
  readonly archive: boolean;

  @ApiProperty()
  @IsString()
  @IsDefined()
  readonly statusId: string;

  @ApiProperty()
  @IsString()
  @IsDefined()
  readonly jobPostId: string;

  @ApiProperty()
  @IsString()
  @IsDefined()
  readonly userId: string;
}
