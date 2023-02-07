import { CacheModuleOptions, CacheOptionsFactory, CacheStore, Injectable } from '@nestjs/common';
import { RedisClientOptions } from 'redis';
import { redisStore } from 'cache-manager-redis-store';
import { StoreConfig } from 'cache-manager';

@Injectable()
export class CacheConfigService implements CacheOptionsFactory {
  async createCacheOptions(): Promise<CacheModuleOptions> {
    if (process.env.NODE_ENV === 'production') {
      const redisOptions: RedisClientOptions & StoreConfig = {
        socket: {
          host: process.env.VIEWTUBE_REDIS_HOST,
          port: parseInt(process.env.VIEWTUBE_REDIS_PORT)
        },
        database: 0
      };

      if (process.env.VIEWTUBE_REDIS_PASSWORD) {
        redisOptions.password = process.env.VIEWTUBE_REDIS_PASSWORD;
      }

      const store = await redisStore(redisOptions);

      return {
        store: store as unknown as CacheStore,
        max: 20000,
        ttl: 1800
      };
    }

    // Development options
    return {
      ttl: 0,
      max: 2000
    };
  }
}
