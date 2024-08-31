import { NestFactory } from '@nestjs/core';
import { ProductServiceModule } from './product-service.module';
import { ValidationPipe } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(ProductServiceModule, { bufferLogs: true });

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Use Winston as the logger
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  const configService = app.get(ConfigService);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Product Service API')
    .setDescription(
      `The Product Service manages product-related operations and shopping cart functionalities.
      It includes two main modules:
      - **Product Module**: Provides endpoints for creating, updating, retrieving, and managing products.
      - **Cart Module**: Handles shopping cart operations, including adding products to the cart, updating cart items, and viewing cart details.`
    )
    .addTag('Base URL', 'http://localhost/')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('product-service-docs', app, document);

  await app.listen(configService.get('PORT'));
}
bootstrap();
