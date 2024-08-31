import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule, { bufferLogs: true });
    
  const configService = app.get(ConfigService);

  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: configService.get('TCP_PORT'),
    },
  });
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Use Winston as the logger
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  // app.useLogger(app.get(Logger));

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Auth Service API')
    .setDescription(`The Users service provides endpoints to manage user-related functionalities. 
    It consists of two main submodules: 
    - **Auth**: Contains endpoints for authentication, including the login endpoint.
    - **Users**: Handles other user-related operations such as registration, profile management, and user details retrieval.`)
    .addTag('Base URL', 'http://localhost/')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('auth-service-docs', app, document);

  await app.startAllMicroservices();

  await app.listen(configService.get('PORT'));
}
bootstrap();
