import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtService {
  private readonly JWT_SECRET = process.env.JWT_SECRET;
}
