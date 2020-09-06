import { IsString } from 'class-validator';

export class JobPostDto {
  @IsString()
  title: string;

  @IsString()
  companyName: string;

  @IsString()
  url: string;
}
