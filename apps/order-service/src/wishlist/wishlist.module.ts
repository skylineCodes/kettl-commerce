import { Module } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { WishlistController } from './wishlist.controller';
import { AUTH_SERVICE, DatabaseModule, JwtAuthGuard } from '@app/common';
import { Wishlist } from './models/wishlist.schema';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { WishlistRepository } from './wishlist.repository';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forTypeOrmRoot({
      entities: [Wishlist],
      type: 'mariadb',
    }),
    DatabaseModule.forTypeOrmFeature([Wishlist]),
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
  providers: [WishlistService, WishlistRepository, JwtAuthGuard],
  exports: [WishlistService, WishlistRepository],
  controllers: [WishlistController],
})
export class WishlistModule {}
