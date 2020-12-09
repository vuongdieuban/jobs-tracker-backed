import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserEntity } from '../shared/entities/user.entity';
import { UserService } from './user.service';
@UseGuards(JwtAuthGuard)
@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  public async findAll(): Promise<UserEntity[]> {
    return this.userService.findAll();
  }

  @Get('/:id')
  public async findOne(@Param('id') id: string): Promise<UserEntity> {
    return this.userService.findUserById(id);
  }
}
