import { sqliteTable, text as sqliteText, integer as sqliteInteger } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ════════════════════════════════════════════════════════════════════════════
// ПОЛЬЗОВАТЕЛИ И РОЛИ
// ════════════════════════════════════════════════════════════════════════════
export const users = sqliteTable("users", {
  id: sqliteInteger("id").primaryKey({ autoIncrement: true }),
  email: sqliteText("email").notNull().unique(),
  password: sqliteText("password").notNull(),
  firstName: sqliteText("first_name").notNull(),
  lastName: sqliteText("last_name").notNull(),
  role: sqliteText("role").notNull(), // 'admin', 'dean', 'teacher', 'student'
  groupId: sqliteInteger("group_id"), // для студентов
  createdAt: sqliteInteger("created_at", { mode: 'timestamp' }).default(new Date()),
});

export const groups = sqliteTable("groups", {
  id: sqliteInteger("id").primaryKey({ autoIncrement: true }),
  name: sqliteText("name").notNull().unique(), // e.g., "группа 101"
  specialty: sqliteText("specialty"), // специальность
  yearOfStudy: sqliteInteger("year_of_study"), // 1, 2, 3, 4
  createdAt: sqliteInteger("created_at", { mode: 'timestamp' }).default(new Date()),
});

export const groupMembers = sqliteTable("group_members", {
  id: sqliteInteger("id").primaryKey({ autoIncrement: true }),
  groupId: sqliteInteger("group_id").notNull(),
  userId: sqliteInteger("user_id").notNull(),
  joinedAt: sqliteInteger("joined_at", { mode: 'timestamp' }).default(new Date()),
});

// ════════════════════════════════════════════════════════════════════════════
// НОВОСТИ
// ════════════════════════════════════════════════════════════════════════════
export const news = sqliteTable("news", {
  id: sqliteInteger("id").primaryKey({ autoIncrement: true }),
  titleRu: sqliteText("title_ru").notNull(),
  titleEn: sqliteText("title_en"),
  contentRu: sqliteText("content_ru").notNull(),
  contentEn: sqliteText("content_en"),
  imageUrl: sqliteText("image_url"),
  authorId: sqliteInteger("author_id").notNull(), // связь с пользователем
  publishedAt: sqliteInteger("published_at", { mode: 'timestamp' }).default(new Date()),
});

// ════════════════════════════════════════════════════════════════════════════
// РАСПИСАНИЕ
// ════════════════════════════════════════════════════════════════════════════
export const schedule = sqliteTable("schedule", {
  id: sqliteInteger("id").primaryKey({ autoIncrement: true }),
  group: sqliteText("group").notNull(),
  dayOfWeek: sqliteInteger("day_of_week").notNull(), // 1-6 (пн-сб)
  startTime: sqliteText("start_time").notNull(), // HH:MM
  endTime: sqliteText("end_time").notNull(),
  subject: sqliteText("subject").notNull(),
  teacher: sqliteText("teacher"),
  classroom: sqliteText("classroom"),
});

// ════════════════════════════════════════════════════════════════════════════
// КОНТАКТЫ
// ════════════════════════════════════════════════════════════════════════════
export const contacts = sqliteTable("contacts", {
  id: sqliteInteger("id").primaryKey({ autoIncrement: true }),
  name: sqliteText("name").notNull(),
  department: sqliteText("department"),
  email: sqliteText("email"),
  phone: sqliteText("phone"),
  position: sqliteText("position"),
});

// ════════════════════════════════════════════════════════════════════════════
// ОБЪЯВЛЕНИЯ
// ════════════════════════════════════════════════════════════════════════════
export const announcements = sqliteTable("announcements", {
  id: sqliteInteger("id").primaryKey({ autoIncrement: true }),
  titleRu: sqliteText("title_ru").notNull(),
  descriptionRu: sqliteText("description_ru").notNull(),
  type: sqliteText("type").notNull(), // important, warning, info
  active: sqliteInteger("active", { mode: 'boolean' }).default(true),
  publishedAt: sqliteInteger("published_at", { mode: 'timestamp' }).default(new Date()),
});

// ════════════════════════════════════════════════════════════════════════════
// ДОКУМЕНТЫ
// ════════════════════════════════════════════════════════════════════════════
export const documents = sqliteTable("documents", {
  id: sqliteInteger("id").primaryKey({ autoIncrement: true }),
  nameRu: sqliteText("name_ru").notNull(),
  category: sqliteText("category").notNull(),
  fileUrl: sqliteText("file_url").notNull(),
  uploadedAt: sqliteInteger("uploaded_at", { mode: 'timestamp' }).default(new Date()),
});

// ════════════════════════════════════════════════════════════════════════════
// ZОДИ СХЕМЫ
// ════════════════════════════════════════════════════════════════════════════
export const insertUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.enum(['admin', 'dean', 'teacher', 'student']),
  groupId: z.number().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const insertGroupSchema = z.object({
  name: z.string().min(1),
  specialty: z.string().optional(),
  yearOfStudy: z.number().optional(),
});

export const insertNewsSchema = createInsertSchema(news).omit({ id: true, publishedAt: true, authorId: true });
export const insertScheduleSchema = createInsertSchema(schedule).omit({ id: true });
export const insertContactSchema = createInsertSchema(contacts).omit({ id: true });
export const insertAnnouncementSchema = createInsertSchema(announcements).omit({ id: true, publishedAt: true });
export const insertDocumentSchema = createInsertSchema(documents).omit({ id: true, uploadedAt: true });

// ════════════════════════════════════════════════════════════════════════════
// ТИПЫ
// ════════════════════════════════════════════════════════════════════════════
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Group = typeof groups.$inferSelect;
export type InsertGroup = z.infer<typeof insertGroupSchema>;

export type GroupMember = typeof groupMembers.$inferSelect;

export type News = typeof news.$inferSelect;
export type InsertNews = z.infer<typeof insertNewsSchema>;

export type Schedule = typeof schedule.$inferSelect;
export type InsertSchedule = z.infer<typeof insertScheduleSchema>;

export type Contact = typeof contacts.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;

export type Announcement = typeof announcements.$inferSelect;
export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;

export type Document = typeof documents.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
