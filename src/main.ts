import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { runDbSeed } from './database-config/seeds';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(5000);

  if (process.env.NODE_ENV === 'development') {
    // await runDbSeed();
  }
}
bootstrap();
