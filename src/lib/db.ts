import importModels from "@/models";
import mongoose, { Mongoose } from "mongoose";

const MONGODB_URL = process.env.DB_URI;

if (!MONGODB_URL) {
  throw new Error("Set the environmental variable.");
}

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  var mongoose: MongooseCache;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async (): Promise<Mongoose> => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose
      .connect(MONGODB_URL, opts)
      .then((mongoose) => mongoose);
  }

  try {
    importModels();
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  console.log("db connected successfully");

  return cached.conn;
};

export default connectDB;
