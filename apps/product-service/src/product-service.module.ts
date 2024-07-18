import { Module } from '@nestjs/common';
import * as Joi from 'joi';
import { ProductServiceService } from './product-service.service';
import { ProductServiceController } from './product-service.controller';
import { AUTH_SERVICE, DatabaseModule, LoggerModule } from '@app/common';
import { ProductSchema, ProductServiceDocument } from './models/product-service.schema';
import { ProductServiceRepository } from './product-service.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: ProductServiceDocument.name, schema: ProductSchema },
    ]),
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
        AUTH_HOST: Joi.string().required(),
        AUTH_PORT: Joi.number().required(),
      }),
    }),
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('AUTH_HOST'),
            port: configService.get('AUTH_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [ProductServiceController],
  providers: [ProductServiceService, ProductServiceRepository],
  // exports: [ProductServiceService, ProductServiceRepository],
})
export class ProductServiceModule {}
