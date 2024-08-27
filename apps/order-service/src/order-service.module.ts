import { forwardRef, MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { OrderServiceController } from './order-service.controller';
import { OrderServiceService } from './order-service.service';
import { AUTH_SERVICE, CacheModule, DatabaseModule, JwtAuthGuard } from '@app/common';
import { Order } from './models/order-service.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Joi from 'joi';
import { LoggerModule } from '@app/common';
import { OrderItem } from './models/order-item.schema';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OrderRepository } from './order-service.repository';
import { CartModule } from './cart/cart.module';
import { CartController } from './cart/cart.controller';
import { WishlistModule } from './wishlist/wishlist.module';
import { WishlistController } from './wishlist/wishlist.controller';
import { RedisCacheMiddleware } from 'middleware/redis-cache.middleware';
import { UsersRepository } from 'apps/auth/src/users/users.repository';
import { UserDocument, UserSchema } from 'apps/auth/src/users/models/user.schema';
import { UsersModule } from 'apps/auth/src/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema, ProductServiceDocument } from 'apps/product-service/src/models/product-service.schema';
import { ProductServiceRepository } from 'apps/product-service/src/product-service.repository';

@Module({
  imports: [
    // WishlistModule,
    // CartModule,
    forwardRef(() => WishlistModule),
    DatabaseModule,
    DatabaseModule.forTypeOrmRoot({
      entities: [Order, OrderItem],
      type: 'mariadb',
    }),
    DatabaseModule.forTypeOrmFeature([Order, OrderItem]),
    MongooseModule.forFeature([{ name: UserDocument.name, schema: UserSchema }, { name: ProductServiceDocument.name, schema: ProductSchema }]),
    CacheModule,
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        AUTH_HOST: Joi.string().required(),
        AUTH_PORT: Joi.number().required(),
      }),
    }),
    LoggerModule,
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('AUTH_HOST'),
            port: configService.get<number>('AUTH_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [OrderServiceService, OrderRepository, UsersRepository, ProductServiceRepository, JwtAuthGuard],
  controllers: [OrderServiceController, WishlistController],
})

export class OrderServiceModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(RedisCacheMiddleware)
    }
}
