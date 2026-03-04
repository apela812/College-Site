import { pgTable, text, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { sqliteTable, text as sqliteText, integer as sqliteInteger } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Keep PG for potential future use or if env says so, but we'll focus on SQLite for the project
export const news = sqliteTable("news", {
  id: sqliteInteger("id").primaryKey({ autoIncrement: true }),
  titleRu: sqliteText("title_ru").notNull(),
  titleEn: sqliteText("title_en").notNull(),
  titleTt: sqliteText("title_tt").notNull(),
  contentRu: sqliteText("content_ru").notNull(),
  contentEn: sqliteText("content_en").notNull(),
  contentTt: sqliteText("content_tt").notNull(),
  imageUrl: sqliteText("image_url"),
  publishedAt: sqliteInteger("published_at", { mode: 'timestamp' }).default(new Date()),
});

export const insertNewsSchema = createInsertSchema(news).omit({ id: true, publishedAt: true });

export type News = typeof news.$inferSelect;
export type InsertNews = z.infer<typeof insertNewsSchema>;
export type NewsResponse = News;
export type NewsListResponse = News[];
