import { forwardRef, MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import * as Joi from 'joi';
import { ProductServiceService } from './product-service.service';
import { ProductServiceController } from './product-service.controller';
import { AUTH_SERVICE, CacheModule, DatabaseModule, JwtAuthGuard, LoggerModule } from '@app/common';
import { ProductSchema, ProductServiceDocument } from './models/product-service.schema';
import { ProductServiceRepository } from './product-service.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RedisCacheMiddleware } from 'middleware/redis-cache.middleware';
import { CartModule } from './cart/cart.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserDocument, UserSchema } from 'apps/auth/src/users/models/user.schema';
import { CartController } from './cart/cart.controller';
import { UsersRepository } from 'apps/auth/src/users/users.repository';
import { UsersModule } from 'apps/auth/src/users/users.module';

@Module({
  imports: [
    CartModule,
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: ProductServiceDocument.name, schema: ProductSchema },
    ]),
    MongooseModule.forFeature([{ name: UserDocument.name, schema: UserSchema }, { name: ProductServiceDocument.name, schema: ProductSchema }]),
    CacheModule,
    // UsersModule,
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
  controllers: [ProductServiceController, CartController],
  providers: [ProductServiceService, ProductServiceRepository, UsersRepository, JwtAuthGuard],
  exports: [ProductServiceService, ProductServiceRepository],
})

export class ProductServiceModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(RedisCacheMiddleware)
    .forRoutes(
      {
        path: 'product-service',
        method: RequestMethod.GET
      },
      { path: 'product-service/:id', method: RequestMethod.GET },)
  }
}
