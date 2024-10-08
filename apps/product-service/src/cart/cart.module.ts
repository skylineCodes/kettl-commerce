import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CartDocumentRepository } from './cart.repository';
import { CartDocument, CartSchema } from './models/cart.schema';
import { AUTH_SERVICE, DatabaseModule, JwtAuthGuard } from '@app/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserDocument, UserSchema } from 'apps/auth/src/users/models/user.schema';
import { ProductSchema, ProductServiceDocument } from 'apps/product-service/src/models/product-service.schema';
import { ProductServiceRepository } from 'apps/product-service/src/product-service.repository';
import { UsersRepository } from 'apps/auth/src/users/users.repository';
import { ThrottlerGuard, ThrottlerModule, ThrottlerModuleOptions } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      useFactory: (): ThrottlerModuleOptions => ({
        throttlers: [
          {
            ttl: 60000,   // Time window in seconds
            limit: 10, // Maximum number of requests per ttl window
          },
        ],
      }),
    }),
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: CartDocument.name, schema: CartSchema },
    ]),
    // DatabaseModule.forFeature([
    //   { name: CartProductDocument.name, schema: CartProductSchema },
    // ]),
    MongooseModule.forFeature([{ name: UserDocument.name, schema: UserSchema }, { name: ProductServiceDocument.name, schema: ProductSchema }]),
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
  providers: [CartDocumentRepository, CartService, UsersRepository, ProductServiceRepository, JwtAuthGuard, {
    provide: APP_GUARD,
    useClass: ThrottlerGuard
  }],
  exports: [CartService, CartDocumentRepository],
  controllers: [CartController],
})
export class CartModule {}
