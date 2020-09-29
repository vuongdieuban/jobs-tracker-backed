import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';

export class LoginRequestDto {
  @ApiProperty({ description: 'Google OAuth2 access_token' })
  @IsString()
  @IsDefined()
  accessToken: string;
}
