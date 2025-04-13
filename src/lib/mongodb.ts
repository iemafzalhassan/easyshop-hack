import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

// Skip database connection during build time
const isBuildTime = process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build';

if (!MONGODB_URI && !isBuildTime) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cached: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  // Skip actual connection during build time
  if (isBuildTime) {
    console.log('Build phase detected, skipping MongoDB connection');
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    console.log('Connecting to MongoDB...');
    
    // Add retry logic for MongoDB connection
    let retries = 5;
    let lastError = null;
    
    while (retries > 0) {
      try {
        cached.promise = mongoose.connect(MONGODB_URI, opts);
        break;
      } catch (error) {
        console.error(`MongoDB connection attempt failed. Retries left: ${retries}`);
        lastError = error;
        retries--;
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    if (retries === 0 && lastError) {
      console.error('All MongoDB connection attempts failed:', lastError);
      throw lastError;
    }
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;