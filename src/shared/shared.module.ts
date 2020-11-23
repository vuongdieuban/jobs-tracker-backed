import { Module } from '@nestjs/common';
import { ReorderPositionService } from './services/reorder-position/reorder-position.service';

@Module({
  imports: [],
  providers: [ReorderPositionService],
  exports: [ReorderPositionService],
})
export class SharedModule {}
