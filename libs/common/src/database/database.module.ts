import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ModelDefinition, MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // MongoDB configuration
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [ConfigService],
})
export class DatabaseModule {
  static forFeature(models: ModelDefinition[]): DynamicModule {
    return MongooseModule.forFeature(models);
  }

  static forTypeOrmFeature(
    entities: Function[],
    connectionName?: string,
  ): DynamicModule {
    return TypeOrmModule.forFeature(entities, connectionName);
  }

  static forTypeOrmRoot(
    options?: DataSourceOptions,
    connectionName?: string,
  ): DynamicModule {
    return TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'mariadb',
        host: configService.get('MARIADB_HOST'),
        port: configService.get('MARIADB_PORT'),
        username: configService.get('MARIADB_USER'),
        password: configService.get('MARIADB_PASSWORD'),
        database: configService.get('MARIADB_DB'),
        entities: options?.entities,
        synchronize: true,
      }),
      inject: [ConfigService],
      name: connectionName,
    });
  }
}
