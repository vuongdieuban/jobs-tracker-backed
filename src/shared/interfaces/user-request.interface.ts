import { Request } from 'express';
import { UserInfoFromToken } from './user-info-from-token.interface';

export interface UserRequest extends Request {
  user: UserInfoFromToken;
}
