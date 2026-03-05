import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import type { User } from '@shared/schema';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

/**
 * Хеширование пароля
 */
export function hashPassword(password: string): string {
  return crypto
    .pbkdf2Sync(password, 'salt-' + password, 1000, 64, 'sha512')
    .toString('hex');
}

/**
 * Проверка пароля
 */
export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

/**
 * Генерирование временного пароля для студента
 */
export function generateTemporaryPassword(): string {
  return crypto.randomBytes(6).toString('hex').toUpperCase();
}

/**
 * Создание JWT токена
 */
export function createToken(user: User): string {
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      groupId: user.groupId,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
  return token;
}

/**
 * Проверка и декодирование JWT токена
 */
export function verifyToken(token: string): any {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Интерфейс для payload токена
 */
export interface TokenPayload {
  id: number;
  email: string;
  role: 'admin' | 'dean' | 'teacher' | 'student';
  firstName: string;
  lastName: string;
  groupId?: number;
}

/**
 * Проверка разрешения на действие
 */
export function hasPermission(userRole: string, requiredRoles: string[]): boolean {
  return requiredRoles.includes(userRole);
}
