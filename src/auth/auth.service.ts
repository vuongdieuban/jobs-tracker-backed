import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateUser(email: string) {
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      return null;
    }
    return user;
  }
}
