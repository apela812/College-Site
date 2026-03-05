import { db } from "./db";
import {
  news,
  schedule,
  contacts,
  announcements,
  documents,
  users,
  groups,
  groupMembers,
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
  type User,
  type InsertUser,
  type Group,
  type InsertGroup,
  type GroupMember,
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Auth & Users
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserById(id: number): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<User>): Promise<User>;

  // Groups
  getGroups(): Promise<Group[]>;
  getGroupById(id: number): Promise<Group | undefined>;
  createGroup(group: InsertGroup): Promise<Group>;
  addUserToGroup(userId: number, groupId: number): Promise<GroupMember>;
  removeUserFromGroup(userId: number, groupId: number): Promise<void>;
  getGroupMembers(groupId: number): Promise<User[]>;
  getStudentsByGroup(groupId: number): Promise<User[]>;

  // News
  getNews(): Promise<News[]>;
  getNewsItem(id: number): Promise<News | undefined>;
  createNewsItem(newsItem: InsertNews): Promise<News>;
  updateNewsItem(id: number, newsItem: Partial<InsertNews>): Promise<News>;
  deleteNewsItem(id: number): Promise<void>;

  // Schedule
  getSchedule(group?: string): Promise<Schedule[]>;
  createScheduleItem(item: InsertSchedule): Promise<Schedule>;
  updateScheduleItem(id: number, item: Partial<InsertSchedule>): Promise<Schedule>;
  deleteScheduleItem(id: number): Promise<void>;

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
  // ПОЛЬЗОВАТЕЛИ И АУТЕНТИФИКАЦИЯ
  // ════════════════════════════════════════════════════════════════════════════
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = db.select().from(users).where(eq(users.email, email)).all();
    return user;
  }

  async getUserById(id: number): Promise<User | undefined> {
    const [user] = db.select().from(users).where(eq(users.id, id)).all();
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [created] = db.insert(users).values(user).returning().all();
    return created;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    const [updated] = db.update(users).set(data).where(eq(users.id, id)).returning().all();
    return updated;
  }

  async getAllUsers(): Promise<User[]> {
    return db.select().from(users).all();
  }

  // ════════════════════════════════════════════════════════════════════════════
  // ГРУППЫ И ЧЛЕНЫ ГРУПП
  // ════════════════════════════════════════════════════════════════════════════
  async getGroups(): Promise<Group[]> {
    return db.select().from(groups).orderBy(groups.name).all();
  }

  async getGroupById(id: number): Promise<Group | undefined> {
    const [group] = db.select().from(groups).where(eq(groups.id, id)).all();
    return group;
  }

  async createGroup(group: InsertGroup): Promise<Group> {
    const [created] = db.insert(groups).values(group).returning().all();
    return created;
  }

  async addUserToGroup(userId: number, groupId: number): Promise<GroupMember> {
    const [member] = db.insert(groupMembers).values({ userId, groupId }).returning().all();
    // Update user's groupId
    db.update(users).set({ groupId }).where(eq(users.id, userId)).run();
    return member;
  }

  async removeUserFromGroup(userId: number, groupId: number): Promise<void> {
    db.delete(groupMembers).where(eq(groupMembers.userId, userId)).run();
    db.update(users).set({ groupId: null }).where(eq(users.id, userId)).run();
  }

  async getGroupMembers(groupId: number): Promise<User[]> {
    const members = db
      .select({ user: users })
      .from(groupMembers)
      .where(eq(groupMembers.groupId, groupId))
      .innerJoin(users, eq(groupMembers.userId, users.id))
      .all();
    return members.map(m => m.user);
  }

  async getStudentsByGroup(groupId: number): Promise<User[]> {
    const members = db
      .select({ user: users })
      .from(groupMembers)
      .where(eq(groupMembers.groupId, groupId))
      .innerJoin(users, eq(groupMembers.userId, users.id))
      .all();
    return members.map(m => m.user).filter(u => u.role === 'student');
  }

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

  async updateNewsItem(id: number, newsItem: Partial<InsertNews>): Promise<News> {
    const [updated] = db.update(news).set(newsItem).where(eq(news.id, id)).returning().all();
    return updated;
  }

  async deleteNewsItem(id: number): Promise<void> {
    db.delete(news).where(eq(news.id, id)).run();
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

  async updateScheduleItem(id: number, item: Partial<InsertSchedule>): Promise<Schedule> {
    const [updated] = db.update(schedule).set(item).where(eq(schedule.id, id)).returning().all();
    return updated;
  }

  async deleteScheduleItem(id: number): Promise<void> {
    db.delete(schedule).where(eq(schedule.id, id)).run();
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
