import { forwardRef, Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CartRepository } from './cart.repository';
import { Cart, CartProduct } from './models/cart.schema';
import { AUTH_SERVICE, DatabaseModule, JwtAuthGuard } from '@app/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserDocument, UserSchema } from 'apps/auth/src/users/models/user.schema';
import { ProductSchema, ProductServiceDocument } from 'apps/product-service/src/models/product-service.schema';
import { ProductServiceRepository } from 'apps/product-service/src/product-service.repository';
import { UsersRepository } from 'apps/auth/src/users/users.repository';
import { WishlistModule } from '../wishlist/wishlist.module';

@Module({
  imports: [
    forwardRef(() => WishlistModule),
    DatabaseModule,
    DatabaseModule.forTypeOrmRoot({
      entities: [Cart, CartProduct],
      type: 'mariadb',
    }),
    DatabaseModule.forTypeOrmFeature([Cart, CartProduct]),
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
  providers: [CartService, CartRepository, UsersRepository, ProductServiceRepository, JwtAuthGuard],
  exports: [CartService, CartRepository],
  controllers: [CartController],
})
export class CartModule {}
