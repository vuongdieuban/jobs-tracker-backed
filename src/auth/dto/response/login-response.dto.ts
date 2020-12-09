import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from 'src/shared/entities/user.entity';

export class LoginResponseDto {
  @ApiProperty({
    description:
      'JWT token that is used to access protected endpoint. Set as Authorization Bearer token in request header',
  })
  accessToken: string;

  @ApiProperty({ description: 'User info' })
  user: UserEntity;
}
