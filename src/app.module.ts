import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConnectionService } from './database-connection/database-connection.service';
import { JobPostModule } from './job-post/job-post.module';
import { AppGateway } from './app.gateway';

@Module({
  imports: [
    JobPostModule,
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConnectionService,
    })
  ],
  controllers: [],
  providers: [AppGateway],
})
export class AppModule { }
