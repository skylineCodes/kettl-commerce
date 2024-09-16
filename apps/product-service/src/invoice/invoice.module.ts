import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { AUTH_SERVICE, DatabaseModule, JwtAuthGuard } from '@app/common';
import { Invoice, InvoiceSchema } from './models/invoice-schema';
import { InvoiceRepository } from './invoice.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { UserDocument, UserSchema } from 'apps/auth/src/users/models/user.schema';
import { ProductSchema, ProductServiceDocument } from '../models/product-service.schema';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { UsersRepository } from 'apps/auth/src/users/users.repository';
import { ProductServiceRepository } from '../product-service.repository';
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
      { name: Invoice.name, schema: InvoiceSchema },
    ]),
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
  providers: [InvoiceRepository, InvoiceService, UsersRepository, ProductServiceRepository, JwtAuthGuard, {
    provide: APP_GUARD,
    useClass: ThrottlerGuard
  }],
  controllers: [InvoiceController],
  exports: [InvoiceService, InvoiceRepository],
})
export class InvoiceModule {}
