import { NestFactory } from '@nestjs/core';
import { OrderServiceModule } from './order-service.module';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(OrderServiceModule, { bufferLogs: true });

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Use Winston as the logger
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  const configService = app.get(ConfigService);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Order Service API')
    .setDescription(
      `The Order Service handles operations related to managing orders and wishlists. 
      It includes two main modules: 
      - **Order Module**: Provides endpoints to create, update, retrieve, and manage orders.
      - **Wishlist Module**: Manages users' wishlists, including adding items to the wishlist and retrieving wishlist details.`
    )
    .addTag('Base URL', 'http://localhost/')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('order-service-docs', app, document);

  await app.listen(configService.get('PORT'));
}
bootstrap();
