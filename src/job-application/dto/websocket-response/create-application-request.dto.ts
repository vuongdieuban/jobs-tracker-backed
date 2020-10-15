import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';

export class CreateApplicationRequestDto {
  @ApiProperty()
  @IsString()
  @IsDefined()
  readonly statusId: string;

  @ApiProperty()
  @IsString()
  @IsDefined()
  readonly userId: string;

  @ApiProperty()
  @IsString()
  @IsDefined()
  readonly jobPostId: string;
}
