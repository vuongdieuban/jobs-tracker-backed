import { IsString } from 'class-validator';

export class JobPostDTO {
  @IsString()
  title: string;

  @IsString()
  companyName: string;

  @IsString()
  url: string;
}

