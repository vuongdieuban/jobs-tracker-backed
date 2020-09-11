import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';

export class JobPostDto {
  @ApiProperty()
  @IsString()
  @IsDefined()
  title: string;

  @ApiProperty()
  @IsString()
  @IsDefined()
  companyName: string;

  @ApiProperty()
  @IsString()
  @IsDefined()
  url: string;

  @ApiProperty()
  @IsString()
  @IsDefined()
  location: string;

  @ApiProperty()
  @IsString()
  @IsDefined()
  platformId: string;

  @ApiProperty()
  @IsString()
  @IsDefined()
  platformJobKey: string;
}
