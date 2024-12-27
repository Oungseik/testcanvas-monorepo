import type { User } from "@repo/domain";
import { MongoClient } from "mongodb";

export const db = new MongoClient(process.env.MONGO_URL ?? "mongodb://localhost:27017").db(
  process.env.DB_NAME ?? "TestCanvasDemo",
);

export const users = db.collection<User & { password: string }>("users");
users.createIndex({ email: 1 });
