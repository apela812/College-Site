import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // ════════════════════════════════════════════════════════════════════════════
  // НОВОСТИ
  // ════════════════════════════════════════════════════════════════════════════
  app.get(api.news.list.path, async (req, res) => {
    try {
      const newsList = await storage.getNews();
      res.json(newsList);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.news.get.path, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      
      const newsItem = await storage.getNewsItem(id);
      if (!newsItem) {
        return res.status(404).json({ message: "News not found" });
      }
      res.json(newsItem);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(api.news.create.path, async (req, res) => {
    try {
      const input = api.news.create.input.parse(req.body);
      const newsItem = await storage.createNewsItem(input);
      res.status(201).json(newsItem);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // ════════════════════════════════════════════════════════════════════════════
  // РАСПИСАНИЕ
  // ════════════════════════════════════════════════════════════════════════════
  app.get("/api/schedule", async (req, res) => {
    try {
      const group = req.query.group as string | undefined;
      const scheduleList = await storage.getSchedule(group);
      res.json(scheduleList);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/schedule/groups", async (req, res) => {
    try {
      const scheduleList = await storage.getSchedule();
      const groups = Array.from(new Set(scheduleList.map(s => s.group)));
      res.json(groups);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // ════════════════════════════════════════════════════════════════════════════
  // КОНТАКТЫ
  // ════════════════════════════════════════════════════════════════════════════
  app.get("/api/contacts", async (req, res) => {
    try {
      const contacts = await storage.getContacts();
      res.json(contacts);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // ════════════════════════════════════════════════════════════════════════════
  // ОБЪЯВЛЕНИЯ
  // ════════════════════════════════════════════════════════════════════════════
  app.get("/api/announcements", async (req, res) => {
    try {
      const announcements = await storage.getAnnouncements();
      res.json(announcements);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // ════════════════════════════════════════════════════════════════════════════
  // ДОКУМЕНТЫ
  // ════════════════════════════════════════════════════════════════════════════
  app.get("/api/documents", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const documents = await storage.getDocuments(category);
      res.json(documents);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // ════════════════════════════════════════════════════════════════════════════
  // ЗАПОЛНЕНИЕ БД НАЧАЛЬНЫМИ ДАННЫМИ
  // ════════════════════════════════════════════════════════════════════════════
  async function seedDatabase() {
    try {
      const existingNews = await storage.getNews();
      if (existingNews.length === 0) {
        // Новости
        await storage.createNewsItem({
          titleRu: "День открытых дверей",
          contentRu: "Приглашаем будущих абитуриентов и их родителей на день открытых дверей Альметьевского медицинского колледжа.",
          imageUrl: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=800",
        });

        await storage.createNewsItem({
          titleRu: "Студенческая научная конференция",
          contentRu: "Наши студенты приняли участие в ежегодной научной конференции и заняли призовые места.",
          imageUrl: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=800",
        });

        await storage.createNewsItem({
          titleRu: "Новое оборудование для практических занятий",
          contentRu: "В колледж поступили новые манекены для отработки навыков оказания первой медицинской помощи.",
          imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800",
        });
      }

      // Расписание
      const existingSchedule = await storage.getSchedule();
      if (existingSchedule.length === 0) {
        const groups = ["М-101", "М-102", "Л-201"];
        for (const group of groups) {
          await storage.createScheduleItem({
            group,
            dayOfWeek: 1,
            startTime: "08:30",
            endTime: "09:50",
            subject: "Анатомия человека",
            teacher: "Петров И.П.",
            classroom: "101",
          });

          await storage.createScheduleItem({
            group,
            dayOfWeek: 1,
            startTime: "10:00",
            endTime: "11:20",
            subject: "Физиология",
            teacher: "Сидоров А.В.",
            classroom: "102",
          });
        }
      }

      // Контакты
      const existingContacts = await storage.getContacts();
      if (existingContacts.length === 0) {
        await storage.createContact({
          name: "Директор",
          department: "Администрация",
          email: "director@almetmed.ru",
          phone: "+7 (8553) 43-43-34",
          position: "Директор",
        });

        await storage.createContact({
          name: "Учебная часть",
          department: "Администрация",
          email: "education@almetmed.ru",
          phone: "+7 (8553) 43-43-50",
          position: "Начальник учебной части",
        });

        await storage.createContact({
          name: "Приёмная комиссия",
          department: "Приём",
          email: "admission@almetmed.ru",
          phone: "+7 (8553) 43-43-60",
          position: "Секретарь приёмной комиссии",
        });
      }

      // Объявления
      const existingAnnouncements = await storage.getAnnouncements();
      if (existingAnnouncements.length === 0) {
        await storage.createAnnouncement({
          titleRu: "Важно! Начало учебного года",
          descriptionRu: "Учебный год начинается 1 сентября. Все студенты должны быть в колледже за 15 минут до начала занятий.",
          type: "important",
        });

        await storage.createAnnouncement({
          titleRu: "Профилактическое обслуживание",
          descriptionRu: "15 апреля будет проведено плановое обслуживание компьютерного класса. Занятия перенесены в корпус 2.",
          type: "warning",
        });

        await storage.createAnnouncement({
          titleRu: "Новые курсы повышения квалификации",
          descriptionRu: "Для преподавателей доступны новые курсы повышения квалификации. Запись на сайте личного кабинета.",
          type: "info",
        });
      }

      // Документы
      const existingDocuments = await storage.getDocuments();
      if (existingDocuments.length === 0) {
        await storage.createDocument({
          nameRu: "Правила внутреннего распорядка",
          category: "regulations",
          fileUrl: "/documents/rules.pdf",
        });

        await storage.createDocument({
          nameRu: "Учебный план 2025-2026",
          category: "curriculum",
          fileUrl: "/documents/curriculum.pdf",
        });

        await storage.createDocument({
          nameRu: "Форма заявления о приёме",
          category: "forms",
          fileUrl: "/documents/application.pdf",
        });
      }
    } catch (err) {
      console.error("Failed to seed database:", err);
    }
  }

  // Run seed function
  seedDatabase();

  return httpServer;
}
