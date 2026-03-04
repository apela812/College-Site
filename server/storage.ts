import { db } from "./db";
import {
  news,
  schedule,
  contacts,
  announcements,
  documents,
  type News,
  type InsertNews,
  type Schedule,
  type InsertSchedule,
  type Contact,
  type InsertContact,
  type Announcement,
  type InsertAnnouncement,
  type Document,
  type InsertDocument,
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // News
  getNews(): Promise<News[]>;
  getNewsItem(id: number): Promise<News | undefined>;
  createNewsItem(newsItem: InsertNews): Promise<News>;

  // Schedule
  getSchedule(group?: string): Promise<Schedule[]>;
  createScheduleItem(item: InsertSchedule): Promise<Schedule>;

  // Contacts
  getContacts(): Promise<Contact[]>;
  createContact(item: InsertContact): Promise<Contact>;

  // Announcements
  getAnnouncements(): Promise<Announcement[]>;
  createAnnouncement(item: InsertAnnouncement): Promise<Announcement>;

  // Documents
  getDocuments(category?: string): Promise<Document[]>;
  createDocument(item: InsertDocument): Promise<Document>;
}

export class DatabaseStorage implements IStorage {
  // ════════════════════════════════════════════════════════════════════════════
  // НОВОСТИ
  // ════════════════════════════════════════════════════════════════════════════
  async getNews(): Promise<News[]> {
    return db.select().from(news).orderBy(desc(news.publishedAt)).all();
  }

  async getNewsItem(id: number): Promise<News | undefined> {
    const [newsItem] = db.select().from(news).where(eq(news.id, id)).all();
    return newsItem;
  }

  async createNewsItem(insertNews: InsertNews): Promise<News> {
    const [newsItem] = db.insert(news).values(insertNews).returning().all();
    return newsItem;
  }

  // ════════════════════════════════════════════════════════════════════════════
  // РАСПИСАНИЕ
  // ════════════════════════════════════════════════════════════════════════════
  async getSchedule(group?: string): Promise<Schedule[]> {
    const query = db.select().from(schedule);
    if (group) {
      return query.where(eq(schedule.group, group)).all();
    }
    return query.all();
  }

  async createScheduleItem(item: InsertSchedule): Promise<Schedule> {
    const [result] = db.insert(schedule).values(item).returning().all();
    return result;
  }

  // ════════════════════════════════════════════════════════════════════════════
  // КОНТАКТЫ
  // ════════════════════════════════════════════════════════════════════════════
  async getContacts(): Promise<Contact[]> {
    return db.select().from(contacts).all();
  }

  async createContact(item: InsertContact): Promise<Contact> {
    const [result] = db.insert(contacts).values(item).returning().all();
    return result;
  }

  // ════════════════════════════════════════════════════════════════════════════
  // ОБЪЯВЛЕНИЯ
  // ════════════════════════════════════════════════════════════════════════════
  async getAnnouncements(): Promise<Announcement[]> {
    return db
      .select()
      .from(announcements)
      .where(eq(announcements.active, true))
      .orderBy(desc(announcements.publishedAt))
      .all();
  }

  async createAnnouncement(item: InsertAnnouncement): Promise<Announcement> {
    const [result] = db.insert(announcements).values(item).returning().all();
    return result;
  }

  // ════════════════════════════════════════════════════════════════════════════
  // ДОКУМЕНТЫ
  // ════════════════════════════════════════════════════════════════════════════
  async getDocuments(category?: string): Promise<Document[]> {
    const query = db.select().from(documents);
    if (category) {
      return query.where(eq(documents.category, category)).all();
    }
    return query.orderBy(desc(documents.uploadedAt)).all();
  }

  async createDocument(item: InsertDocument): Promise<Document> {
    const [result] = db.insert(documents).values(item).returning().all();
    return result;
  }
}

export const storage = new DatabaseStorage();
