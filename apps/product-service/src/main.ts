import { NestFactory } from '@nestjs/core';
import { ProductServiceModule } from './product-service.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(ProductServiceModule, { bufferLogs: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useLogger(app.get(Logger));
  const configService = app.get(ConfigService);

  await app.listen(configService.get('PORT'));
}
bootstrap();
