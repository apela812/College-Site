import { pgTable, text, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const news = pgTable("news", {
  id: serial("id").primaryKey(),
  titleRu: text("title_ru").notNull(),
  titleEn: text("title_en").notNull(),
  titleTt: text("title_tt").notNull(),
  contentRu: text("content_ru").notNull(),
  contentEn: text("content_en").notNull(),
  contentTt: text("content_tt").notNull(),
  imageUrl: text("image_url"),
  publishedAt: timestamp("published_at").defaultNow(),
});

export const insertNewsSchema = createInsertSchema(news).omit({ id: true, publishedAt: true });

export type News = typeof news.$inferSelect;
export type InsertNews = z.infer<typeof insertNewsSchema>;
export type NewsResponse = News;
export type NewsListResponse = News[];
