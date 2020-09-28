import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppGateway } from './app.gateway';
import { AuthModule } from './auth/auth.module';
import { DatabaseConnectionService } from './database-config/database-connection.service';
import { JobApplicationStatusModule } from './job-application-status/job-application-status.module';
import { JobApplicationModule } from './job-application/job-application.module';
import { JobPostModule } from './job-post/job-post.module';
import { PlatformModule } from './platform/platform.module';
import { TransformInterceptor } from './shared/interceptors/transform.interceptor';
import { SharedModule } from './shared/shared.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConnectionService
    }),
    JobPostModule,
    PlatformModule,
    JobApplicationModule,
    JobApplicationStatusModule,
    UserModule,
    AuthModule,
    SharedModule
  ],
  controllers: [],
  providers: [
    AppGateway,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor
    }
  ]
})
export class AppModule {}
