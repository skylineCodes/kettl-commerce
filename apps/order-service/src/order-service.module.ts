import { Module } from '@nestjs/common';
import { OrderServiceController } from './order-service.controller';
import { OrderServiceService } from './order-service.service';
import { AUTH_SERVICE, DatabaseModule } from '@app/common';
import { Order } from './models/order-service.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { LoggerModule } from '@app/common';
import { OrderItem } from './models/order-item.schema';
// import { UsersModule } from 'apps/auth/src/users/users.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
// import { AuthModule } from 'apps/auth/src/auth.module';
import { OrderRepository } from './order-service.repository';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forTypeOrmRoot({
      entities: [Order, OrderItem],
      type: 'mariadb',
    }),
    DatabaseModule.forTypeOrmFeature([Order, OrderItem]),
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
  providers: [OrderServiceService, OrderRepository],
  controllers: [OrderServiceController],
})
export class OrderServiceModule {}
