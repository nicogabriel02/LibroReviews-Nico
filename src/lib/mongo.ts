import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;
if (!MONGODB_URI) throw new Error("Missing MONGODB_URI");

type TCached = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
declare global { // cache para hot-reload
  // eslint-disable-next-line no-var
  var _mongooseCache: TCached | undefined;
}
const globalCache = global._mongooseCache ?? { conn: null, promise: null };
global._mongooseCache = globalCache;

export async function connectMongo() {
  if (globalCache.conn) return globalCache.conn;
  if (!globalCache.promise) {
    globalCache.promise = mongoose.connect(MONGODB_URI, {
      dbName: "libro",
      maxPoolSize: 10,
    });
  }
  globalCache.conn = await globalCache.promise;
  return globalCache.conn;
}
