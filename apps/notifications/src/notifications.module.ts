import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { DatabaseModule, LoggerModule } from '@app/common';
import { ProductServiceService } from 'apps/product-service/src/product-service.service';
import { ProductServiceRepository } from 'apps/product-service/src/product-service.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema, ProductServiceDocument } from 'apps/product-service/src/models/product-service.schema';

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([{ name: ProductServiceDocument.name, schema: ProductSchema }]),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        MONGODB_URI: Joi.string().required(),
        SMTP_USER: Joi.string().required(),
        GOOGLE_OAUTH_CLIENT_ID: Joi.string().required(),
        GOOGLE_OAUTH_CLIENT_SECRET: Joi.string().required(),
        GOOGLE_OAUTH_REFRESH_TOKEN: Joi.string().required(),
      }),
    }),
    LoggerModule,
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, ProductServiceService, ProductServiceRepository],
})
export class NotificationsModule {}
