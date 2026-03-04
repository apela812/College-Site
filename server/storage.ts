import { db } from "./db";
import {
  news,
  type NewsResponse,
  type NewsListResponse,
  type InsertNews
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getNews(): Promise<NewsListResponse>;
  getNewsItem(id: number): Promise<NewsResponse | undefined>;
  createNewsItem(newsItem: InsertNews): Promise<NewsResponse>;
}

export class DatabaseStorage implements IStorage {
  async getNews(): Promise<NewsListResponse> {
    return db.select().from(news).orderBy(desc(news.publishedAt)).all();
  }

  async getNewsItem(id: number): Promise<NewsResponse | undefined> {
    const [newsItem] = db.select().from(news).where(eq(news.id, id)).all();
    return newsItem;
  }

  async createNewsItem(insertNews: InsertNews): Promise<NewsResponse> {
    const [newsItem] = db.insert(news).values(insertNews).returning().all();
    return newsItem;
  }
}

export const storage = new DatabaseStorage();
