import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlatformEntity } from './entities/platform.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PlatformEntity])],
  controllers: [],
  providers: [],
  exports: []
})
export class PlatformModule {}
