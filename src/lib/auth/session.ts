import { SessionData } from '../types/cache';
import dbConnect from '../db';
import User from '../models/user';

export async function verifySession(sessionId: string): Promise<SessionData | null> {
  try {
    await dbConnect();
    const user = await User.findById(sessionId);
    
    if (!user) {
      return null;
    }

    return {
      _id: user._id.toString(),
      userId: user._id.toString(),
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    };
  } catch (error) {
    console.error('Session verification error:', error);
    return null;
  }
}