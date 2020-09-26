import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { getConnection } from 'typeorm';
import { AppModule } from './app.module';
import { runDbSeed } from './database-config/seeds';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe());

  if (process.env.NODE_ENV === 'development') {
    const conn = getConnection();
    await runDbSeed(conn.manager);
  }

  const options = new DocumentBuilder()
    .setTitle('Verification Service API Documentation')
    .setDescription('')
    .setVersion('')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(5000);
}
bootstrap();
