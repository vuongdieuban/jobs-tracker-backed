import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { getConnection } from 'typeorm';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const conn = getConnection();
  await conn.runMigrations();

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
