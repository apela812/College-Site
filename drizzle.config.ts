import { defineConfig } from "drizzle-kit";
import path from "path";

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: path.resolve("./database/sqlite.db"),
  },
});
