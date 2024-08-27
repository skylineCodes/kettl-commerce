import { forwardRef, Module } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { WishlistController } from './wishlist.controller';
import { AUTH_SERVICE, DatabaseModule, JwtAuthGuard } from '@app/common';
import { Wishlist } from './models/wishlist.schema';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { WishlistRepository } from './wishlist.repository';
import { UserDocument, UserSchema } from 'apps/auth/src/users/models/user.schema';
import { ProductSchema, ProductServiceDocument } from 'apps/product-service/src/models/product-service.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersRepository } from 'apps/auth/src/users/users.repository';
import { ProductServiceRepository } from 'apps/product-service/src/product-service.repository';
import { CartModule } from '../cart/cart.module';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forTypeOrmRoot({
      entities: [Wishlist],
      type: 'mariadb',
    }),
    DatabaseModule.forTypeOrmFeature([Wishlist]),
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
  providers: [WishlistService, WishlistRepository, UsersRepository, ProductServiceRepository, JwtAuthGuard],
  exports: [WishlistService, WishlistRepository],
  controllers: [WishlistController],
})
export class WishlistModule {}
