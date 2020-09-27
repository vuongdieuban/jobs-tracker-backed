import { Module } from '@nestjs/common';
import { JwtService } from './services';

@Module({
  imports: [],
  providers: [JwtService],
  exports: [JwtService]
})
export class SharedModule {}
