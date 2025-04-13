import { redisClient } from './client';
import { CacheData } from '../types/cache';

export const cacheService = {
  async get<T extends CacheData>(key: string): Promise<T | null> {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  },

  async set<T extends CacheData>(key: string, value: T, ttl: number): Promise<void> {
    await redisClient.setex(key, ttl, JSON.stringify(value));
  },

  async del(key: string): Promise<void> {
    await redisClient.del(key);
  }
};