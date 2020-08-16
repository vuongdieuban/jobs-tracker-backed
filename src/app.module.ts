import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppGateway } from './app.gateway';
import { AppService } from './app.service';
import { DatabaseConnectionService } from './database-connection/database-connection.service';
import { JobPostModule } from './job-post/job-post.module';

@Module({
  imports: [
    JobPostModule,
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConnectionService,
    })
  ],
  controllers: [],
  providers: [AppGateway, AppService],
})
export class AppModule { }
