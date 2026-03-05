import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { authMiddleware, requireRole } from "./middleware";
import {
  hashPassword,
  verifyPassword,
  createToken,
  generateTemporaryPassword,
} from "./auth";
import { insertUserSchema, loginSchema, insertGroupSchema, insertScheduleSchema } from "@shared/schema";
import { checkAndInitializeDatabase } from "./db-init";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Инициализируем БД при первом запуске
  checkAndInitializeDatabase();
  
  // ════════════════════════════════════════════════════════════════════════════
  // АУТЕНТИФИКАЦИЯ И АВТОРИЗАЦИЯ
  // ════════════════════════════════════════════════════════════════════════════

  /**
   * POST /api/auth/register - Регистрация нового пользователя
   */
  app.post("/api/auth/register", async (req, res) => {
    try {
      const input = insertUserSchema.parse(req.body);

      const existingUser = await storage.getUserByEmail(input.email);
      if (existingUser) {
        return res.status(400).json({ message: "User with this email already exists" });
      }

      const hashedPassword = hashPassword(input.password);
      const user = await storage.createUser({
        ...input,
        password: hashedPassword,
      });

      const token = createToken(user);
      res.status(201).json({
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          groupId: user.groupId,
        },
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join("."),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  /**
   * POST /api/auth/login - Вход в систему
   */
  app.post("/api/auth/login", async (req, res) => {
    try {
      const input = loginSchema.parse(req.body);

      const user = await storage.getUserByEmail(input.email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const passwordMatch = verifyPassword(input.password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const token = createToken(user);
      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          groupId: user.groupId,
        },
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join("."),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  /**
   * GET /api/auth/me - Получить информацию о текущем пользователе
   */
  app.get("/api/auth/me", authMiddleware, async (req, res) => {
    try {
      const user = await storage.getUserById(req.user!.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        groupId: user.groupId,
      });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // ════════════════════════════════════════════════════════════════════════════
  // УПРАВЛЕНИЕ ГРУППАМИ
  // ════════════════════════════════════════════════════════════════════════════

  /**
   * GET /api/groups - Получить все группы
   */
  app.get("/api/groups", async (req, res) => {
    try {
      const groups = await storage.getGroups();
      res.json(groups);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  /**
   * POST /api/groups - Создать новую группу (только админ и завуч)
   */
  app.post(
    "/api/groups",
    authMiddleware,
    requireRole("admin", "dean"),
    async (req, res) => {
      try {
        const input = insertGroupSchema.parse(req.body);
        const group = await storage.createGroup(input);
        res.status(201).json(group);
      } catch (err) {
        if (err instanceof z.ZodError) {
          return res.status(400).json({
            message: err.errors[0].message,
            field: err.errors[0].path.join("."),
          });
        }
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );

  /**
   * GET /api/groups/:id/members - Получить членов группы
   */
  app.get("/api/groups/:id/members", async (req, res) => {
    try {
      const groupId = parseInt(req.params.id);
      if (isNaN(groupId)) {
        return res.status(400).json({ message: "Invalid group ID" });
      }

      const members = await storage.getGroupMembers(groupId);
      res.json(members);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  /**
   * POST /api/groups/:id/members - Добавить пользователя в группу и создать аккаунт
   * Тело: { firstName, lastName, email, role }
   */
  app.post(
    "/api/groups/:id/members",
    authMiddleware,
    requireRole("admin", "dean"),
    async (req, res) => {
      try {
        const groupId = parseInt(req.params.id);
        if (isNaN(groupId)) {
          return res.status(400).json({ message: "Invalid group ID" });
        }

        const { firstName, lastName, email, role } = req.body;

        if (!firstName || !lastName || !email || !role) {
          return res.status(400).json({ message: "Missing required fields" });
        }

        // Проверить, существует ли уже пользователь с таким email
        const existingUser = await storage.getUserByEmail(email);
        let userId = existingUser?.id;

        if (!existingUser) {
          // Создать пользователя с временным паролем
          const tempPassword = generateTemporaryPassword();
          const hashedPassword = hashPassword(tempPassword);

          const newUser = await storage.createUser({
            email,
            firstName,
            lastName,
            password: hashedPassword,
            role: role || "student",
            groupId,
          });

          userId = newUser.id;

          // Вернуть временный пароль
          return res.status(201).json({
            message: "User created successfully",
            user: {
              id: newUser.id,
              email: newUser.email,
              firstName: newUser.firstName,
              lastName: newUser.lastName,
              role: newUser.role,
            },
            temporaryPassword: tempPassword,
            instruction: `Please share this temporary password with the student: ${tempPassword}`,
          });
        }

        // Если пользователь существует, просто добавить в группу
        await storage.addUserToGroup(userId, groupId);

        res.status(200).json({
          message: "User added to group successfully",
          user: existingUser,
        });
      } catch (err) {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );

  /**
   * DELETE /api/groups/:groupId/members/:userId - Удалить пользователя из группы
   */
  app.delete(
    "/api/groups/:groupId/members/:userId",
    authMiddleware,
    requireRole("admin", "dean"),
    async (req, res) => {
      try {
        const groupId = parseInt(req.params.groupId);
        const userId = parseInt(req.params.userId);

        if (isNaN(groupId) || isNaN(userId)) {
          return res.status(400).json({ message: "Invalid IDs" });
        }

        await storage.removeUserFromGroup(userId, groupId);
        res.json({ message: "User removed from group" });
      } catch (err) {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );

  // DELETE /api/groups/:groupId - Удалить группу
  app.delete(
    "/api/groups/:groupId",
    authMiddleware,
    requireRole("admin", "dean"),
    async (req, res) => {
      try {
        const groupId = parseInt(req.params.groupId);

        if (isNaN(groupId)) {
          return res.status(400).json({ message: "Invalid group ID" });
        }

        // Удаляем всех пользователей из группы
        const members = await storage.getGroupMembers(groupId);
        for (const member of members) {
          await storage.removeUserFromGroup(member.userId, groupId);
        }

        res.json({ message: "Group deleted successfully" });
      } catch (err) {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );

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

  app.post(api.news.create.path, authMiddleware, requireRole("admin", "dean"), async (req, res) => {
    try {
      const input = api.news.create.input.parse(req.body);
      const newsItem = await storage.createNewsItem({
        ...input,
        authorId: req.user!.id,
      });
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

  /**
   * PUT /api/news/:id - Обновить новость (только автор, админ или завуч)
   */
  app.put("/api/news/:id", authMiddleware, requireRole("admin", "dean"), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }

      const newsItem = await storage.getNewsItem(id);
      if (!newsItem) {
        return res.status(404).json({ message: "News not found" });
      }

      // Проверить, что это автор или админ
      if (newsItem.authorId !== req.user!.id && req.user!.role !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
      }

      const input = api.news.create.input.parse(req.body);
      const updated = await storage.updateNewsItem(id, input);
      res.json(updated);
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

  /**
   * DELETE /api/news/:id - Удалить новость (только автор, админ или завуч)
   */
  app.delete("/api/news/:id", authMiddleware, requireRole("admin", "dean"), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }

      const newsItem = await storage.getNewsItem(id);
      if (!newsItem) {
        return res.status(404).json({ message: "News not found" });
      }

      // Проверить, что это автор или админ
      if (newsItem.authorId !== req.user!.id && req.user!.role !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
      }

      await storage.deleteNewsItem(id);
      res.json({ message: "News deleted successfully" });
    } catch (err) {
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

  /**
   * POST /api/schedule - Создать запись расписания (только админ или завуч)
   */
  app.post("/api/schedule", authMiddleware, requireRole("admin", "dean"), async (req, res) => {
    try {
      const input = insertScheduleSchema.parse(req.body);
      const scheduleItem = await storage.createScheduleItem(input);
      res.status(201).json(scheduleItem);
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

  /**
   * PUT /api/schedule/:id - Обновить запись расписания (только админ или завуч)
   */
  app.put("/api/schedule/:id", authMiddleware, requireRole("admin", "dean"), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }

      const input = insertScheduleSchema.partial().parse(req.body);
      const updated = await storage.updateScheduleItem(id, input);
      res.json(updated);
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

  /**
   * DELETE /api/schedule/:id - Удалить запись расписания (только админ или завуч)
   */
  app.delete("/api/schedule/:id", authMiddleware, requireRole("admin", "dean"), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }

      await storage.deleteScheduleItem(id);
      res.json({ message: "Schedule item deleted successfully" });
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
      // Создать админа, если его ещё нет
      let admin: any;
      try {
        admin = await storage.getUserByEmail("admin@almetmed.ru");
      } catch (err) {
        console.warn("⚠️  Не удалось получить админа из БД, пропускаю seed");
        return;
      }
      
      if (!admin) {
        const adminPassword = hashPassword("admin123");
        try {
          admin = await storage.createUser({
            email: "admin@almetmed.ru",
            password: adminPassword,
            firstName: "Администратор",
            lastName: "Системы",
            role: "admin",
          });
        } catch (err) {
          console.warn("⚠️  Не удалось создать админа, пропускаю seed");
          return;
        }
      }

      let existingNews: any[] = [];
      try {
        existingNews = await storage.getNews();
      } catch (err) {
        console.warn("⚠️  Не удалось получить новости, пропускаю seed");
        return;
      }
      
      if (existingNews.length === 0) {
        // Новости
        await storage.createNewsItem({
          titleRu: "День открытых дверей",
          contentRu: "Приглашаем будущих абитуриентов и их родителей на день открытых дверей Альметьевского медицинского колледжа.",
          imageUrl: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=800",
          authorId: admin.id,
        });

        await storage.createNewsItem({
          titleRu: "Студенческая научная конференция",
          contentRu: "Наши студенты приняли участие в ежегодной научной конференции и заняли призовые места.",
          imageUrl: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=800",
          authorId: admin.id,
        });

        await storage.createNewsItem({
          titleRu: "Новое оборудование для практических занятий",
          contentRu: "В колледж поступили новые манекены для отработки навыков оказания первой медицинской помощи.",
          imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800",
          authorId: admin.id,
        });
      }

      // Расписание - НЕ создаем статическое, пользователь сам создаст группы и расписание
      // Расписание будет создано через админ-панель

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

  // ════════════════════════════════════════════════════════════════════════════
  // УПРАВЛЕНИЕ ПОЛЬЗОВАТЕЛЯМИ (АДМИН)
  // ════════════════════════════════════════════════════════════════════════════

  /**
   * GET /api/admin/users - Получить всех пользователей (только админ)
   */
  app.get("/api/admin/users", authMiddleware, requireRole("admin"), async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  /**
   * POST /api/admin/users - Создать пользователя с определённой ролью (только админ)
   * Тело: { email, firstName, lastName, role }
   */
  app.post("/api/admin/users", authMiddleware, requireRole("admin"), async (req, res) => {
    try {
      const { email, firstName, lastName, role } = req.body;

      if (!email || !firstName || !lastName || !role) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const validRoles = ["admin", "dean", "teacher", "student"];
      if (!validRoles.includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }

      // Проверить, существует ли уже пользователь
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User with this email already exists" });
      }

      // Создать пользователя с временным паролем
      const tempPassword = generateTemporaryPassword();
      const hashedPassword = hashPassword(tempPassword);

      const newUser = await storage.createUser({
        email,
        firstName,
        lastName,
        password: hashedPassword,
        role,
        groupId: undefined,
      });

      res.status(201).json({
        message: "User created successfully",
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          role: newUser.role,
        },
        temporaryPassword: tempPassword,
      });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  /**
   * PUT /api/admin/users/:id/role - Изменить роль пользователя (только админ)
   */
  app.put("/api/admin/users/:id/role", authMiddleware, requireRole("admin"), async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const { role } = req.body;

      if (isNaN(userId) || !role) {
        return res.status(400).json({ message: "Invalid parameters" });
      }

      const validRoles = ["admin", "dean", "teacher", "student"];
      if (!validRoles.includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }

      // Нельзя менять себе роль
      if (userId === req.user!.id && role !== "admin") {
        return res.status(403).json({ message: "Cannot remove own admin role" });
      }

      const user = await storage.updateUser(userId, { role });
      res.json({
        message: "User role updated successfully",
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  /**
   * DELETE /api/admin/users/:id - Удалить пользователя (только админ)
   */
  app.delete("/api/admin/users/:id", authMiddleware, requireRole("admin"), async (req, res) => {
    try {
      const userId = parseInt(req.params.id);

      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      // Нельзя удалить самого себя
      if (userId === req.user!.id) {
        return res.status(403).json({ message: "Cannot delete your own account" });
      }

      // Получить пользователя
      const user = await storage.getUserById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Если у пользователя есть группа, удалить его из неё
      if (user.groupId) {
        await storage.removeUserFromGroup(userId, user.groupId);
      }

      res.json({ message: "User deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // ════════════════════════════════════════════════════════════════════════════
  // ЭКСПОРТ РАСПИСАНИЯ
  // ════════════════════════════════════════════════════════════════════════════

  /**
   * GET /api/schedule/export/:group - Экспортировать расписание группы как JSON
   */
  app.get("/api/schedule/export/:group", async (req, res) => {
    try {
      const group = req.params.group;
      const schedule = await storage.getSchedule(group);
      
      if (!schedule || schedule.length === 0) {
        return res.status(404).json({ message: "No schedule found for this group" });
      }

      // Установить заголовки для скачивания
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Content-Disposition", `attachment; filename="schedule-${group}.json"`);
      res.json(schedule);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // ════════════════════════════════════════════════════════════════════════════
  // СТАТИСТИКА И АНАЛИТИКА
  // ════════════════════════════════════════════════════════════════════════════

  /**
   * GET /api/admin/stats - Получить статистику системы (только админ)
   */
  app.get("/api/admin/stats", authMiddleware, requireRole("admin"), async (req, res) => {
    try {
      const allUsers = await storage.getAllUsers();
      const allGroups = await storage.getGroups();
      const allNews = await storage.getNews();

      const stats = {
        totalUsers: allUsers.length,
        usersByRole: {
          admin: allUsers.filter(u => u.role === "admin").length,
          dean: allUsers.filter(u => u.role === "dean").length,
          teacher: allUsers.filter(u => u.role === "teacher").length,
          student: allUsers.filter(u => u.role === "student").length,
        },
        totalGroups: allGroups.length,
        totalNews: allNews.length,
        recentNews: allNews.slice(0, 5),
      };

      res.json(stats);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Run seed function
  seedDatabase();

  return httpServer;
}
