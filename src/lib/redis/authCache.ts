import { SessionData } from '../types/cache';
import { cacheService } from './cacheService';

export class AuthCache {
  private static readonly SESSION_PREFIX = 'session:';
  private static readonly TOKEN_PREFIX = 'token:';
  private static readonly SESSION_TTL = 86400; // 24 hours
  private static readonly TOKEN_TTL = 3600; // 1 hour

  static async getSession(sessionId: string): Promise<SessionData | null> {
    return cacheService.get<SessionData>(`${this.SESSION_PREFIX}${sessionId}`);
  }

  static async setSession(sessionId: string, data: SessionData): Promise<void> {
    await cacheService.set<SessionData>(`${this.SESSION_PREFIX}${sessionId}`, data, this.SESSION_TTL);
  }

  static async invalidateSession(sessionId: string): Promise<void> {
    await cacheService.del(`${this.SESSION_PREFIX}${sessionId}`);
  }

  static async isTokenBlacklisted(token: string): Promise<boolean> {
    // Add proper type that satisfies CacheData interface
    const result = await cacheService.get<{ _id: string; blacklisted: boolean }>(
      `${this.TOKEN_PREFIX}blacklist:${token}`
    );
    return !!result?.blacklisted;
  }
  static async blacklistToken(token: string): Promise<void> {
    await cacheService.set(
      `${this.TOKEN_PREFIX}blacklist:${token}`,
      { 
        _id: token,  // Add required _id field
        blacklisted: true 
      },
      this.TOKEN_TTL
    );
  }
}