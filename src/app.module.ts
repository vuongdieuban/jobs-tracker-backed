import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppGateway } from './app.gateway';
import { DatabaseConnectionService } from './database-config/database-connection.service';
import { JobApplicationStatusModule } from './job-application-status/job-application-status.module';
import { JobApplicationModule } from './job-application/job-application.module';
import { JobPostModule } from './job-post/job-post.module';
import { PlatformModule } from './platform/platform.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    JobPostModule,
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConnectionService
    }),
    PlatformModule,
    JobApplicationModule,
    JobApplicationStatusModule,
    UserModule
  ],
  controllers: [],
  providers: [AppGateway]
})
export class AppModule {}
