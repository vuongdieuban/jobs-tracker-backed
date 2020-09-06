import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class JobPostDto {
  @ApiProperty()
  @IsString()
  title: string;

  @IsString()
  @ApiProperty()
  companyName: string;

  @IsString()
  @ApiProperty()
  url: string;
}
