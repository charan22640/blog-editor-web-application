import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectToDb() {
  try {
    if (cached.conn) {
      if (cached.conn.readyState === 1) {  // Check if connection is ready
        return cached.conn;
      }
      // If connection exists but not ready, try to reconnect
      try {
        await cached.conn.close();
      } catch (e) {
        console.warn('Error closing stale connection:', e);
      }
      cached.conn = null;
      cached.promise = null;
    }

    if (!cached.promise) {
      // Updated MongoDB connection options - removed deprecated options
      const opts = {
        bufferCommands: false,
        serverSelectionTimeoutMS: 5000,
        maxPoolSize: 20,
        minPoolSize: 10,
        socketTimeoutMS: 45000,
        family: 4, // Use IPv4, skip trying IPv6
        connectTimeoutMS: 10000
      };

      console.log('Connecting to MongoDB...');
      cached.promise = mongoose.connect(MONGODB_URI!, opts)
        .then((mongoose) => {
          console.log('MongoDB connected successfully');
          return mongoose;
        })
        .catch((error) => {
          console.error('MongoDB connection error details:', error);
          cached.promise = null;
          throw error;
        });
    }

    try {
      cached.conn = await cached.promise;
    } catch (e) {
      cached.promise = null;
      throw e;
    }

    return cached.conn;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}
