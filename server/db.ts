import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import path from "path";
import * as schema from "@shared/schema";

const dbPath = path.resolve("./database/sqlite.db");
const sqlite = new Database(dbPath);
// Enable WAL mode for better performance
sqlite.pragma('journal_mode = WAL');

export const db = drizzle(sqlite, { schema });
