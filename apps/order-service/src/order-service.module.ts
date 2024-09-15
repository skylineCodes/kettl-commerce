import Joi from 'joi';
import { LoggerModule, NOTIFICATIONS_SERVICE } from '@app/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Order } from './models/order-service.schema';
import { OrderItem } from './models/order-item.schema';
import { WishlistModule } from './wishlist/wishlist.module';
import { OrderRepository } from './order-service.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OrderServiceService } from './order-service.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { WishlistController } from './wishlist/wishlist.controller';
import { OrderServiceController } from './order-service.controller';
import { UsersRepository } from 'apps/auth/src/users/users.repository';
import { RedisCacheMiddleware } from 'middleware/redis-cache.middleware';
import { UserDocument, UserSchema } from 'apps/auth/src/users/models/user.schema';
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ProductServiceRepository } from 'apps/product-service/src/product-service.repository';
import { AUTH_SERVICE, CacheModule, DatabaseModule, JwtAuthGuard, PAYMENTS_SERVICE } from '@app/common';
import { ProductSchema, ProductServiceDocument } from 'apps/product-service/src/models/product-service.schema';
import { InvoiceService } from 'apps/product-service/src/invoice/invoice.service';
import { InvoiceRepository } from 'apps/product-service/src/invoice/invoice.repository';
import { Invoice, InvoiceSchema } from 'apps/product-service/src/invoice/models/invoice-schema';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forTypeOrmRoot({
      entities: [Order, OrderItem],
      type: 'mariadb',
    }),
    DatabaseModule.forTypeOrmFeature([Order, OrderItem]),
    MongooseModule.forFeature([{ name: UserDocument.name, schema: UserSchema }, { name: ProductServiceDocument.name, schema: ProductSchema }, { name: Invoice.name, schema: InvoiceSchema }]),
    CacheModule,
    WishlistModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        AUTH_HOST: Joi.string().required(),
        AUTH_PORT: Joi.number().required(),
        PAYMENT_HOST: Joi.string().required(),
        PAYMENT_PORT: Joi.number().required(),
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
      {
        name: PAYMENTS_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('PAYMENT_HOST'),
            port: configService.get('PAYMENT_PORT')
          },
        }),
        inject: [ConfigService]
      },
      {
        name: NOTIFICATIONS_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: ['amqp://admin:kettl-commerce-2202@rabbitmq:5672'],
            queue: 'orders_queue',
            queueOptions: {
              durable: false
            },
          },
        }),
        inject: [ConfigService]
      }
    ]),
  ],
  providers: [OrderServiceService, InvoiceService, OrderRepository, InvoiceRepository, UsersRepository, ProductServiceRepository, JwtAuthGuard],
  controllers: [OrderServiceController, WishlistController],
})

export class OrderServiceModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(RedisCacheMiddleware)
    }
}
