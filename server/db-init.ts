import Database from "better-sqlite3";
import path from "path";

/**
 * Инициализация базы данных - создание всех таблиц
 */
export function checkAndInitializeDatabase() {
  try {
    const dbPath = path.resolve("./database/sqlite.db");
    let sqlite: Database.Database;
    
    try {
      sqlite = new Database(dbPath);
    } catch (err) {
      // Если не можем открыть БД, удалим файл и создадим новую
      try {
        const fs = require('fs');
        if (fs.existsSync(dbPath)) {
          fs.unlinkSync(dbPath);
        }
      } catch (e) {
        console.error("⚠️  Не удалось удалить поврежденную БД:", e);
      }
      sqlite = new Database(dbPath);
    }

    // Проверяем, существует ли таблица users
    const result = sqlite.prepare(
      `SELECT name FROM sqlite_master WHERE type='table' AND name='users'`
    ).all();

    if (result && result.length > 0) {
      console.log("✓ Таблицы уже существуют");
      sqlite.close();
      return;
    }

    console.log("📊 Инициализация базы данных...");

    // Создаем таблицу users
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        role TEXT NOT NULL,
        group_id INTEGER,
        created_at INTEGER DEFAULT (CAST(unixepoch() * 1000 AS INTEGER))
      )
    `);

    // Создаем таблицу groups
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS groups (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        specialty TEXT,
        year_of_study INTEGER,
        created_at INTEGER DEFAULT (CAST(unixepoch() * 1000 AS INTEGER))
      )
    `);

    // Создаем таблицу group_members
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS group_members (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        group_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        joined_at INTEGER DEFAULT (CAST(unixepoch() * 1000 AS INTEGER))
      )
    `);

    // Создаем таблицу news
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS news (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title_ru TEXT NOT NULL,
        title_en TEXT,
        content_ru TEXT NOT NULL,
        content_en TEXT,
        image_url TEXT,
        author_id INTEGER NOT NULL,
        published_at INTEGER DEFAULT (CAST(unixepoch() * 1000 AS INTEGER))
      )
    `);

    // Создаем таблицу schedule
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS schedule (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        "group" TEXT NOT NULL,
        day_of_week INTEGER NOT NULL,
        start_time TEXT NOT NULL,
        end_time TEXT NOT NULL,
        subject TEXT NOT NULL,
        teacher TEXT,
        classroom TEXT
      )
    `);

    // Создаем таблицу contacts
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        department TEXT,
        email TEXT,
        phone TEXT,
        position TEXT
      )
    `);

    // Создаем таблицу announcements
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS announcements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title_ru TEXT NOT NULL,
        description_ru TEXT NOT NULL,
        type TEXT NOT NULL,
        active INTEGER DEFAULT 1,
        published_at INTEGER DEFAULT (CAST(unixepoch() * 1000 AS INTEGER))
      )
    `);

    // Создаем таблицу documents
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name_ru TEXT NOT NULL,
        category TEXT NOT NULL,
        file_url TEXT NOT NULL,
        uploaded_at INTEGER DEFAULT (CAST(unixepoch() * 1000 AS INTEGER))
      )
    `);

    console.log("✓ Таблицы успешно созданы");
    sqlite.close();
  } catch (err) {
    console.error("✗ Ошибка при инициализации БД:", err);
  }
}
