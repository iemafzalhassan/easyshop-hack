import { NextRequest } from 'next/server';
import { AuthCache } from '../redis/authCache';
import { verifyToken } from './utils';
import { verifySession } from './session';
import { SessionData } from '../types/cache';

export async function requireAuth(request: NextRequest): Promise<SessionData> {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      throw new Error('No token provided');
    }

    // Check if token is blacklisted
    const isBlacklisted = await AuthCache.isTokenBlacklisted(token);
    if (isBlacklisted) {
      throw new Error('Token is invalid');
    }

    // Verify token and get session
    const decoded = await verifyToken(token);
    if (!decoded || !decoded.userId) {
      throw new Error('Invalid token payload');
    }

    const sessionId = decoded.userId;

    // Check cached session
    const cachedSession = await AuthCache.getSession(sessionId);
    if (cachedSession) {
      return cachedSession as SessionData;
    }

    // If not in cache, verify from DB and cache
    const session = await verifySession(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }
    
    await AuthCache.setSession(sessionId, session);
    return session;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Authentication failed: ${errorMessage}`);
  }
}