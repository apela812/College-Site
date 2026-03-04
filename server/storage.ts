import { db } from "./db";
import {
  news,
  type NewsResponse,
  type NewsListResponse,
  type InsertNews
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getNews(): Promise<NewsListResponse>;
  getNewsItem(id: number): Promise<NewsResponse | undefined>;
  createNewsItem(newsItem: InsertNews): Promise<NewsResponse>;
}

export class DatabaseStorage implements IStorage {
  async getNews(): Promise<NewsListResponse> {
    return await db.select().from(news);
  }

  async getNewsItem(id: number): Promise<NewsResponse | undefined> {
    const [newsItem] = await db.select().from(news).where(eq(news.id, id));
    return newsItem;
  }

  async createNewsItem(insertNews: InsertNews): Promise<NewsResponse> {
    const [newsItem] = await db.insert(news).values(insertNews).returning();
    return newsItem;
  }
}

export const storage = new DatabaseStorage();
