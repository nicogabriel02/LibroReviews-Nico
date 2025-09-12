import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongod: MongoMemoryServer;

export async function setupMemoryMongo() {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri("libro-test");
  await mongoose.connect(uri);
}

export async function teardownMemoryMongo() {
  await mongoose.disconnect();
  if (mongod) await mongod.stop();
}
