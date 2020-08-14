import { IsString } from 'class-validator';

export class JobPostDTO {
  @IsString()
  companyName: string;

  @IsString()
  url: string;
}

