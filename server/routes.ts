import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
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

  // Seed data function
  async function seedDatabase() {
    try {
      const existingNews = await storage.getNews();
      if (existingNews.length === 0) {
        await storage.createNewsItem({
          titleRu: "День открытых дверей",
          titleEn: "Open Day",
          titleTt: "Ачык ишекләр көне",
          contentRu: "Приглашаем будущих абитуриентов и их родителей на день открытых дверей Альметьевского медицинского колледжа.",
          contentEn: "We invite future applicants and their parents to the Open Day of the Almetyevsk Medical College.",
          contentTt: "Киләчәк абитуриентларны һәм аларның ата-аналарын Әлмәт медицина көллиятенең Ачык ишекләр көненә чакырабыз.",
          imageUrl: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=800",
        });

        await storage.createNewsItem({
          titleRu: "Студенческая научная конференция",
          titleEn: "Student Scientific Conference",
          titleTt: "Студентлар фәнни конференциясе",
          contentRu: "Наши студенты приняли участие в ежегодной научной конференции и заняли призовые места.",
          contentEn: "Our students took part in the annual scientific conference and won prizes.",
          contentTt: "Безнең студентлар еллык фәнни конференциядә катнаштылар һәм призлы урыннар яуладылар.",
          imageUrl: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=800",
        });

        await storage.createNewsItem({
          titleRu: "Новое оборудование для практических занятий",
          titleEn: "New equipment for practical classes",
          titleTt: "Практик дәресләр өчен яңа җиһазлар",
          contentRu: "В колледж поступили новые манекены для отработки навыков оказания первой медицинской помощи.",
          contentEn: "The college received new mannequins to practice first aid skills.",
          contentTt: "Колледжга беренче медицина ярдәме күрсәтү күнекмәләрен эшләү өчен яңа манекеннар килде.",
          imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800",
        });
      }
    } catch (err) {
      console.error("Failed to seed database:", err);
    }
  }

  // Run seed function after routes are registered
  seedDatabase();

  return httpServer;
}
