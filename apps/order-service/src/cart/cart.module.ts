import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CartRepository } from './cart.repository';
import { Cart, CartProduct } from './models/cart.schema';
import { AUTH_SERVICE, DatabaseModule, JwtAuthGuard } from '@app/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forTypeOrmRoot({
      entities: [Cart, CartProduct],
      type: 'mariadb',
    }),
    DatabaseModule.forTypeOrmFeature([Cart, CartProduct]),
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
  providers: [CartService, CartRepository, JwtAuthGuard],
  exports: [CartService, CartRepository],
  controllers: [CartController],
})
export class CartModule {}
