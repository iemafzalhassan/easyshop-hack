import Redis from 'ioredis';

// Skip Redis connection during build time
const isBuildTime = process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build';

// Create a mock Redis client for build time
const createMockRedisClient = () => {
  return {
    get: async () => null,
    set: async () => 'OK',
    del: async () => 1,
    ping: async () => 'PONG',
    on: () => {},
  } as unknown as Redis;
};

// Define the verification function outside of any blocks
async function verifyRedisConnection(client: Redis) {
  try {
    await client.ping();
    console.log('✅ Redis connection verified');
  } catch (error) {
    console.error('❌ Redis connection failed:', error);
    // Don't exit process - allow for retry
  }
}

// Use real Redis client or mock based on environment
export const redisClient = isBuildTime 
  ? createMockRedisClient()
  : new Redis(process.env.REDIS_URI || 'redis://localhost:6379', {
      maxRetriesPerRequest: 5,
      retryStrategy: (times) => {
        const delay = Math.min(times * 100, 3000);
        console.log(`Redis connection retry attempt ${times} in ${delay}ms`);
        return delay;
      },
      reconnectOnError: (err) => {
        const targetError = 'READONLY';
        if (err.message.includes(targetError)) {
          return true;
        }
        return false;
      }
    });

if (!isBuildTime) {
  redisClient.on('error', (error) => {
    console.error('Redis Client Error:', error);
    // Don't exit process on error - just log it
  });

  redisClient.on('connect', () => {
    console.log('Redis Client Connected');
  });

  // Call verification on initial load
  verifyRedisConnection(redisClient);
}