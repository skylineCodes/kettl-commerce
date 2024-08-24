import { Module } from "@nestjs/common";
import { CacheModule as CacheManagerModule, CacheModuleOptions } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    CacheManagerModule.registerAsync<CacheModuleOptions>({ 
      isGlobal: true, 
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get<string>('REDIS_HOST'),
        port: configService.get<number>('REDIS_PORT'),
      }),
    })
  ],
  providers: [ConfigService],
})

export class CacheModule {}